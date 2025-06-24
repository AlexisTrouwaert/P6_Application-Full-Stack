package com.mddapi.repository;

import com.mddapi.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Topic p SET p.articleCount = p.articleCount + :count WHERE p.id = :topicId")
    void incrementViewCount(@Param("topicId") Long topicId, @Param("count") int count);

}
