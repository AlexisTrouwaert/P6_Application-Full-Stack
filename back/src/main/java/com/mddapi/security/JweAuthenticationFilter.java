package com.mddapi.security;

import com.mddapi.service.CustomUserDetailService;
import com.mddapi.service.JweService;
import io.micrometer.common.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JweAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JweAuthenticationFilter.class);

    private final JweService jweService;
    private final CustomUserDetailService customUserDetailService;

    public JweAuthenticationFilter(
            JweService jweService,
            CustomUserDetailService customUserDetailService
    ) {
        this.jweService = jweService;
        this.customUserDetailService = customUserDetailService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain chain
    ) throws ServletException, IOException {

        String requestURI = request.getRequestURI();

        if (requestURI.startsWith("/api/auth/register") || requestURI.startsWith("/api/auth/login")) {
            logger.debug("Ignoring authentication for public endpoint: {}", requestURI);
            chain.doFilter(request, response);
            return;
        }

        String token = null;

        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if ("access_token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null) {
            logger.debug("No JWE access token found in cookies for request: {}", requestURI);
            chain.doFilter(request, response);
            return;
        }

        String email = null;

        try {
            email = jweService.decryptJWE(token);
            logger.debug("Successfully decrypted JWE token for email: {}", email);
        } catch (Exception e) {
            logger.error("Failed to decrypt JWE token for requestURI: {}. Error: {}", requestURI, e.getMessage(), e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            return;
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = customUserDetailService.loadUserByUsername(email);

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
                logger.info("User '{}' successfully authenticated via JWE token.", email);
            } catch (UsernameNotFoundException e) {
                logger.warn("Authentication failed for email '{}': User not found. RequestURI: {}", email, requestURI); // WARN si l'utilisateur n'existe plus
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            } catch (Exception e) {
                logger.error("An unexpected error occurred during authentication for email '{}' on requestURI: {}. Error: {}", email, requestURI, e.getMessage(), e); // Loggez l'exception complète
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        chain.doFilter(request, response);
    }
}
