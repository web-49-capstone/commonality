DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS user_interest;
DROP TABLE IF EXISTS interest;
DROP TABLE IF EXISTS match;
DROP TABLE IF EXISTS "user";




CREATE TABLE IF NOT EXISTS "user"(
    user_id           uuid PRIMARY KEY,
    user_name         varchar(100)  NOT NULL,
    user_email        varchar       NOT NULL,
    user_hash         char(97)      NOT NULL,
    user_bio          varchar(255)  NOT NULL,
    user_availability varchar(127),
    user_img_url      varchar(255)  NOT NULL,
    user_city         varchar(17)   NOT NULL,
    user_state        varchar(2)    NOT NULL,
    user_lat          numeric(6, 3) NOT NULL,
    user_lng          numeric(6, 3) NOT NULL
);

CREATE TABLE IF NOT EXISTS match(
    match_maker_id    uuid,
    match_receiver_id uuid,
    match_accepted    bool,
    FOREIGN KEY (match_maker_id) REFERENCES "user" (user_id),
    FOREIGN KEY (match_receiver_id) REFERENCES "user" (user_id)

);
CREATE INDEX ON match (match_maker_id);
CREATE INDEX ON match (match_receiver_id);


CREATE TABLE IF NOT EXISTS interest(
    interest_id   uuid PRIMARY KEY,
    interest_name varchar(50)
);

CREATE TABLE IF NOT EXISTS user_interest(
    user_interest_interest_id uuid,
    user_interest_user_id     uuid,
    FOREIGN KEY (user_interest_interest_id) REFERENCES interest (interest_id),
    FOREIGN KEY (user_interest_user_id) REFERENCES "user" (user_id)
);
CREATE INDEX ON user_interest (user_interest_interest_id);
CREATE INDEX ON user_interest (user_interest_user_id);



CREATE TABLE IF NOT EXISTS message(
    message_id          uuid PRIMARY KEY,
    message_receiver_id uuid        NOT NULL,
    message_sender_id   uuid        NOT NULL,
    message_body        text        NOT NULL,
    message_sent_at     timestamptz NOT NULL,
    FOREIGN KEY(message_receiver_id) REFERENCES "user"(user_id),
    FOREIGN KEY(message_sender_id) REFERENCES "user"(user_id)
);
CREATE INDEX ON message(message_receiver_id);
CREATE INDEX ON message(message_sender_id);

-- CREATE TABLE group_message (
--                                  group_message_id uuid PRIMARY KEY,
--                                  group_message_sender_id uuid,
--                                  group_message_group_id uuid,
--                                  group_message_body text,
--                                  group_message_sent_at timestamp
-- );
-- CREATE TABLE IF NOT EXISTS groups (
--                           group_id uuid PRIMARY KEY,
--                           group_name varchar,
--                           group_admin_user_id uuid,
--                           group_description text,
--                           group_size varchar(10)
-- );
-- CREATE TABLE group_interests (
--                                    tied_group_id uuid,
--                                    tied_interest_id uuid
-- );

-- CREATE TABLE group_members (
--                                  member_user_id uuid,
--                                  member_group_id uuid
-- );


