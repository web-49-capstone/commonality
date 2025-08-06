DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS user_interest;
DROP TABLE IF EXISTS group_interests;
DROP TABLE IF EXISTS group_members;
DROP TABLE IF EXISTS match;
DROP TABLE IF EXISTS interest;
DROP TABLE IF EXISTS "group";
DROP TABLE IF EXISTS "user";




CREATE TABLE IF NOT EXISTS "user"(
    user_id           uuid PRIMARY KEY,
    user_activation_token char(32),
    user_availability varchar(127),
    user_bio          varchar(255),
    user_city         varchar(50),
    user_created      timestamptz,
    user_email        varchar(128)       NOT NULL UNIQUE ,
    user_hash         char(97)      NOT NULL,
    user_img_url      varchar(255),
    user_lat          numeric(6, 3),
    user_lng          numeric(6, 3),
    user_name         varchar(100),
    user_state        varchar(2)
);

CREATE TABLE IF NOT EXISTS "group"(
    group_id uuid PRIMARY KEY NOT NULL,
    group_name varchar(100) NOT NULL,
    group_admin_user_id uuid NOT NULL,
    group_description text,
    group_size integer,
    group_created timestamptz NOT NULL,
    group_updated timestamptz NOT NULL,
    FOREIGN KEY (group_admin_user_id) REFERENCES "user"(user_id)
);
CREATE INDEX ON "group" (group_admin_user_id);

CREATE TABLE IF NOT EXISTS interest(
    interest_id   uuid PRIMARY KEY,
    interest_name varchar(50)
);

CREATE TABLE IF NOT EXISTS group_members(
    user_id uuid NOT NULL,
    group_id uuid NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id),
    FOREIGN KEY (group_id) REFERENCES "group"(group_id),
    PRIMARY KEY (user_id, group_id)
);
CREATE INDEX ON group_members (user_id);
CREATE INDEX ON group_members (group_id);

CREATE TABLE IF NOT EXISTS group_interests(
    interest_id uuid NOT NULL,
    group_id uuid NOT NULL,
    FOREIGN KEY (interest_id) REFERENCES interest(interest_id),
    FOREIGN KEY (group_id) REFERENCES "group"(group_id),
    PRIMARY KEY (interest_id, group_id)
);
CREATE INDEX ON group_interests (interest_id);
CREATE INDEX ON group_interests (group_id);

CREATE TABLE IF NOT EXISTS match(
    match_maker_id    uuid NOT NULL ,
    match_receiver_id uuid NOT NULL ,
    match_accepted    bool,
    match_created timestamptz NOT NULL,
    FOREIGN KEY (match_maker_id) REFERENCES "user" (user_id),
    FOREIGN KEY (match_receiver_id) REFERENCES "user" (user_id),
    PRIMARY KEY (match_maker_id, match_receiver_id)

);
CREATE INDEX ON match (match_maker_id);
CREATE INDEX ON match (match_receiver_id);

CREATE TABLE IF NOT EXISTS user_interest(
    user_interest_interest_id uuid,
    user_interest_user_id     uuid,
    FOREIGN KEY (user_interest_interest_id) REFERENCES interest (interest_id),
    FOREIGN KEY (user_interest_user_id) REFERENCES "user" (user_id),
    PRIMARY KEY (user_interest_interest_id, user_interest_user_id)
);
CREATE INDEX ON user_interest (user_interest_interest_id);
CREATE INDEX ON user_interest (user_interest_user_id);



CREATE TABLE IF NOT EXISTS message(
    message_id          uuid PRIMARY KEY,
    message_receiver_id uuid        NOT NULL,
    message_sender_id   uuid        NOT NULL,
    message_body        text        NOT NULL,
    message_opened      bool        NOT NULL,
    message_sent_at     timestamptz NOT NULL,
    FOREIGN KEY(message_receiver_id) REFERENCES "user"(user_id),
    FOREIGN KEY(message_sender_id) REFERENCES "user"(user_id)
);
CREATE INDEX ON message(message_receiver_id);
CREATE INDEX ON message(message_sender_id);

CREATE TABLE IF NOT EXISTS group_match (
    group_match_user_id uuid NOT NULL,
    group_match_group_id uuid NOT NULL,
    group_match_accepted bool,
    group_match_created timestamptz NOT NULL,
    FOREIGN KEY (group_match_user_id) REFERENCES "user" (user_id),
    FOREIGN KEY (group_match_group_id) REFERENCES "group" (group_id),
    PRIMARY KEY (group_match_user_id, group_match_group_id)
);
CREATE INDEX ON group_match (group_match_user_id);
CREATE INDEX ON group_match (group_match_group_id);





INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-7db7-9de3-320d4078618c', 'Gaming');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-7b32-987d-d40fbfb8f19b', 'Hiking');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-751d-b90d-e70a3458bfc5', 'Coding');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-7952-b1e5-a345a56da742', 'Music');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-7dfb-bb83-89186745ad30', 'Fitness');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-761b-8b88-7e82cd4beea0', 'Art');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-7f75-868e-991859349e2f', 'Photography');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-71c1-9c30-ae2f273b263c', 'Cooking');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-7ac8-bdde-48624f423083', 'Writing');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-73c9-9bb7-c1994b9e74ef', 'Traveling');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-791f-9f8f-c45c2a90d9fc', 'Reading');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-7168-a762-78baab3d49b6', 'Dancing');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-7eec-82d7-90935dc36e5e', 'Yoga');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-7bf5-90f1-8c88edc8660e', 'Meditation');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-723e-9597-af52fe0323bf', 'Gardening');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-7368-804c-cbe253bd3f0f', 'Running');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-706a-86ef-e830d2918d5e', 'Cycling');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-7ac4-ac35-6a9256b8b51d', 'Swimming');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-7621-805d-cca7e9a6a31b', 'Board Games');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-7d6c-abb3-35f9f134b8b0', 'Chess');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-79b2-be3c-f97403ed45c8', 'Movies');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-7c3b-9e20-1777db6bf461', 'Theater');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-76dd-8a2c-70995f81f6b7', 'Podcasting');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-7ea9-acda-9fa3ae627685', 'DIY Projects');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-7339-8d52-17f2b2560bd6', 'Technology');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-7f00-8f29-86a110bb1b32', 'Machine Learning');
INSERT INTO interest (interest_id, interest_name) VALUES ('019837fd-b294-7951-b6fd-810279618fd9', 'AI');


-- @author Dylan McDonald <dmcdonald21@cnm.edu>
-- drop the procedure if already defined
DROP FUNCTION IF EXISTS haversine(FLOAT, FLOAT, FLOAT, FLOAT);

-- function to calculate the distance between two points using the Haversine formula
-- @param FLOAT originX point of origin, x coordinate (longitude)
-- @param FLOAT originY point of origin, y coordinate (latitude)
-- @param FLOAT destinationX point heading out, x coordinate (longitude)
-- @param FLOAT destinationY point heading out, y coordinate (latitude)
-- @return FLOAT distance between the points, in miles
CREATE OR REPLACE FUNCTION haversine(originX FLOAT, originY FLOAT, destinationX FLOAT, destinationY FLOAT)
    RETURNS FLOAT
    LANGUAGE plpgsql
AS $$
DECLARE
    -- first, all variables; I don't think you can declare later
    radius FLOAT;
    latitudeAngle1 FLOAT;
    latitudeAngle2 FLOAT;
    latitudePhase FLOAT;
    longitudePhase FLOAT;
    alpha FLOAT;
    corner FLOAT;
    distance FLOAT;
BEGIN
    -- assign the variables that were declared & use them
    radius := 3958.7613; -- radius of the earth in miles
    latitudeAngle1 := RADIANS(originY);
    latitudeAngle2 := RADIANS(destinationY);
    latitudePhase := RADIANS(destinationY - originY);
    longitudePhase := RADIANS(destinationX - originX);
    alpha := POW(SIN(latitudePhase / 2), 2) + COS(latitudeAngle1) * COS(latitudeAngle2) * POW(SIN(longitudePhase / 2), 2);
    corner := 2 * ASIN(SQRT(alpha));
    distance := radius * corner;

    RETURN distance;
END;
$$;
-- Create group_message table for group messaging
CREATE TABLE IF NOT EXISTS group_message (
                                             group_message_id uuid PRIMARY KEY,
                                             group_message_group_id uuid NOT NULL,
                                             group_message_user_id uuid NOT NULL,
                                             group_message_body text NOT NULL,
                                             group_message_sent_at timestamptz NOT NULL DEFAULT NOW(),
                                             FOREIGN KEY (group_message_group_id) REFERENCES "group"(group_id) ON DELETE CASCADE,
                                             FOREIGN KEY (group_message_user_id) REFERENCES "user"(user_id) ON DELETE CASCADE
);

-- Create indexes for group messaging
CREATE INDEX idx_group_message_group_id ON group_message (group_message_group_id);
CREATE INDEX idx_group_message_user_id ON group_message (group_message_user_id);
CREATE INDEX idx_group_message_sent_at ON group_message (group_message_sent_at);