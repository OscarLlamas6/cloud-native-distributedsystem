CREATE SCHEMA IF NOT EXISTS SOPES1 ;
USE SOPES1 ;

CREATE TABLE IF NOT EXISTS SOPES1.TWEET(
  idTweet INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(800) NOT NULL,
  comentario VARCHAR(1000) NOT NULL,
  fecha VARCHAR(800) NOT NULL,
  hashtags VARCHAR(1000) NOT NULL,
  upvotes INT NOT NULL,
  downvotes INT NOT NULL,
  PRIMARY KEY (idTweet));
  
  SELECT * FROM tweet;
  
  INSERT INTO `SOPES1`.`TWEET`
(`nombre`,`comentario`,`fecha`,`hashtags`,`upvotes`,`downvotes`)
VALUES  ('sopes','prueba2','15/09/2021','python,dart',232,166);

/*SELECT SPLITEANDO HASHTAGS*/

SELECT idTweet, nombre, comentario, fecha,
SUBSTRING_INDEX(SUBSTRING_INDEX(hashtags, ',', numbers.n), ',', -1) hashtag,
upvotes, downvotes
FROM (SELECT 1 n UNION ALL SELECT 2
UNION ALL SELECT 3 UNION ALL SELECT 4) numbers INNER JOIN TWEET
ON CHAR_LENGTH(hashtags) -CHAR_LENGTH(REPLACE(hashtags, ',', ''))>=numbers.n-1
ORDER BY idTweet, n;
  
/*TOTAL NOTICIAS*/
SELECT count(*) FROM tweet;
  
/* TOTAL HASHTAGS */
SELECT count(*) 
FROM (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(hashtags, ',', numbers.n), ',', -1) hashtag
FROM (SELECT 1 n UNION ALL SELECT 2
UNION ALL SELECT 3 UNION ALL SELECT 4) numbers INNER JOIN TWEET
ON CHAR_LENGTH(hashtags) -CHAR_LENGTH(REPLACE(hashtags, ',', ''))>=numbers.n-1
group by hashtag) AS ListaHashtags;

/* TOTAL UPVOTES*/
SELECT SUM(upvotes) AS TotalUpvotes from tweet;
    
/* TOTAL UPVOTES V2 */
SELECT SUM(upvotes) AS TotalUpvotes 
from (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(hashtags, ',', numbers.n), ',', -1) hashtag, upvotes
FROM (SELECT 1 n UNION ALL SELECT 2
UNION ALL SELECT 3 UNION ALL SELECT 4) numbers INNER JOIN TWEET
ON CHAR_LENGTH(hashtags) -CHAR_LENGTH(REPLACE(hashtags, ',', ''))>=numbers.n-1) AS ListaHashtags;

/* Top 5 hashtags */
SELECT SUM(upvotes) AS TotalUpvotes, hashtag
from (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(hashtags, ',', numbers.n), ',', -1) hashtag, upvotes
FROM (SELECT 1 n UNION ALL SELECT 2
UNION ALL SELECT 3 UNION ALL SELECT 4) numbers INNER JOIN TWEET
ON CHAR_LENGTH(hashtags) -CHAR_LENGTH(REPLACE(hashtags, ',', ''))>=numbers.n-1) AS ListaHashtags
GROUP BY hashtag
ORDER BY upvotes DESC
LIMIT 5;

/*Upvotes y downvotes por dia*/

SELECT fecha, sum(upvotes) AS upvotes, sum(downvotes) AS downvotes
FROM (SELECT DATE_FORMAT(fecha, '%e/%m/%Y') AS fecha, upvotes, downvotes
FROM (SELECT upvotes, downvotes, STR_TO_DATE(fecha, '%e/%m/%Y') AS fecha FROM tweet) AS FechaConvertida) 
AS FechasFormateadas
GROUP BY  fecha
  