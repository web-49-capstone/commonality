DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS user_interest;
DROP TABLE IF EXISTS interest;
DROP TABLE IF EXISTS match;
DROP TABLE IF EXISTS "user";



CREATE TABLE IF NOT EXISTS "user"
(
    user_id
    uuid
    PRIMARY
    KEY,
    user_activation_token
    char
(
    32
),
    user_availability varchar
(
    127
),
    user_bio varchar
(
    255
),
    user_city varchar
(
    50
),
    user_created timestamptz,
    user_email varchar
(
    128
) NOT NULL UNIQUE ,
    user_hash char
(
    97
) NOT NULL,
    user_img_url varchar
(
    255
),
    user_lat numeric
(
    6,
    3
),
    user_lng numeric
(
    6,
    3
),
    user_name varchar
(
    100
),
    user_state varchar
(
    2
)
    );

CREATE TABLE IF NOT EXISTS match
(
    match_maker_id
    uuid
    NOT
    NULL,
    match_receiver_id
    uuid
    NOT
    NULL,
    match_accepted
    bool,
    match_created
    timestamptz
    NOT
    NULL,
    FOREIGN
    KEY
(
    match_maker_id
) REFERENCES "user"
(
    user_id
),
    FOREIGN KEY
(
    match_receiver_id
) REFERENCES "user"
(
    user_id
),
    PRIMARY KEY
(
    match_maker_id,
    match_receiver_id
)

    );
CREATE INDEX ON match (match_maker_id);
CREATE INDEX ON match (match_receiver_id);


CREATE TABLE IF NOT EXISTS interest
(
    interest_id
    uuid
    PRIMARY
    KEY,
    interest_name
    varchar
(
    50
)
    );

CREATE TABLE IF NOT EXISTS user_interest
(
    user_interest_interest_id
    uuid,
    user_interest_user_id
    uuid,
    FOREIGN
    KEY
(
    user_interest_interest_id
) REFERENCES interest
(
    interest_id
),
    FOREIGN KEY
(
    user_interest_user_id
) REFERENCES "user"
(
    user_id
),
    PRIMARY KEY
(
    user_interest_interest_id,
    user_interest_user_id
)
    );
CREATE INDEX ON user_interest (user_interest_interest_id);
CREATE INDEX ON user_interest (user_interest_user_id);



CREATE TABLE IF NOT EXISTS message
(
    message_id
    uuid
    PRIMARY
    KEY,
    message_receiver_id
    uuid
    NOT
    NULL,
    message_sender_id
    uuid
    NOT
    NULL,
    message_body
    text
    NOT
    NULL,
    message_opened
    bool
    NOT
    NULL,
    message_sent_at
    timestamptz
    NOT
    NULL,
    FOREIGN
    KEY
(
    message_receiver_id
) REFERENCES "user"
(
    user_id
),
    FOREIGN KEY
(
    message_sender_id
) REFERENCES "user"
(
    user_id
)
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
--                           group_size NUMBER(10)
-- );
-- CREATE TABLE group_interests (
--                                    tied_group_id uuid,
--                                    tied_interest_id uuid
-- );

-- CREATE TABLE group_members (
--                                  member_user_id uuid,
--                                  member_group_id uuid
-- );

INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-7db7-9de3-320d4078618c', 'Gaming');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-7b32-987d-d40fbfb8f19b', 'Hiking');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-751d-b90d-e70a3458bfc5', 'Coding');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-7952-b1e5-a345a56da742', 'Music');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-7dfb-bb83-89186745ad30', 'Fitness');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-761b-8b88-7e82cd4beea0', 'Art');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-7f75-868e-991859349e2f', 'Photography');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-71c1-9c30-ae2f273b263c', 'Cooking');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-7ac8-bdde-48624f423083', 'Writing');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-73c9-9bb7-c1994b9e74ef', 'Traveling');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-791f-9f8f-c45c2a90d9fc', 'Reading');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-7168-a762-78baab3d49b6', 'Dancing');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-7eec-82d7-90935dc36e5e', 'Yoga');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-7bf5-90f1-8c88edc8660e', 'Meditation');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-723e-9597-af52fe0323bf', 'Gardening');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-7368-804c-cbe253bd3f0f', 'Running');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-706a-86ef-e830d2918d5e', 'Cycling');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-7ac4-ac35-6a9256b8b51d', 'Swimming');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-7621-805d-cca7e9a6a31b', 'Board Games');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-7d6c-abb3-35f9f134b8b0', 'Chess');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-79b2-be3c-f97403ed45c8', 'Movies');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-7c3b-9e20-1777db6bf461', 'Theater');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-76dd-8a2c-70995f81f6b7', 'Podcasting');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-7ea9-acda-9fa3ae627685', 'DIY Projects');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-7339-8d52-17f2b2560bd6', 'Technology');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-7f00-8f29-86a110bb1b32', 'Machine Learning');
INSERT INTO interest (interest_id, interest_name)
VALUES ('019837fd-b294-7951-b6fd-810279618fd9', 'AI');


-- @author Dylan McDonald <dmcdonald21@cnm.edu>
-- drop the procedure if already defined
DROP FUNCTION IF EXISTS haversine(FLOAT, FLOAT, FLOAT, FLOAT);

-- function to calculate the distance between two points using the Haversine formula
-- @param FLOAT originX point of origin, x coordinate (longitude)
-- @param FLOAT originY point of origin, y coordinate (latitude)
-- @param FLOAT destinationX point heading out, x coordinate (longitude)
-- @param FLOAT destinationY point heading out, y coordinate (latitude)
-- @return FLOAT distance between the points, in miles
CREATE
OR REPLACE FUNCTION haversine(originX FLOAT, originY FLOAT, destinationX FLOAT, destinationY FLOAT)
    RETURNS FLOAT
    LANGUAGE plpgsql
AS $$
DECLARE
    -- first, all variables; I don't think you can declare later
radius FLOAT;
    latitudeAngle1
FLOAT;
    latitudeAngle2
FLOAT;
    latitudePhase
FLOAT;
    longitudePhase
FLOAT;
    alpha
FLOAT;
    corner
FLOAT;
    distance
FLOAT;
BEGIN
    -- assign the variables that were declared & use them
    radius
:= 3958.7613; -- radius of the earth in miles
    latitudeAngle1
:= RADIANS(originY);
    latitudeAngle2
:= RADIANS(destinationY);
    latitudePhase
:= RADIANS(destinationY - originY);
    longitudePhase
:= RADIANS(destinationX - originX);
    alpha
:= POW(SIN(latitudePhase / 2), 2) + COS(latitudeAngle1) * COS(latitudeAngle2) * POW(SIN(longitudePhase / 2), 2);
    corner
:= 2 * ASIN(SQRT(alpha));
    distance
:= radius * corner;

RETURN distance;
END;
$$;


INSERT INTO interest (interest_id, interest_name)
VALUES ('ad238ad4-dbb1-4e7b-8324-a9279bdcce46', 'Skateboarding');
INSERT INTO interest (interest_id, interest_name)
VALUES ('afe4d25d-d591-48c6-9fc3-35ecf99d320f', 'Surfing');
INSERT INTO interest (interest_id, interest_name)
VALUES ('1ab01078-3880-4b7c-a8a2-48075be1395b', 'Rock Climbing');
INSERT INTO interest (interest_id, interest_name)
VALUES ('c249d9e1-3722-4797-8203-00e22b98c240', 'Karaoke');
INSERT INTO interest (interest_id, interest_name)
VALUES ('785f6b1d-f07e-49e6-877e-c6c11651c3b4', 'Stand-up Comedy');
INSERT INTO interest (interest_id, interest_name)
VALUES ('dfba02fc-2fe9-498f-81e7-26a5d58e620e', 'Magic');
INSERT INTO interest (interest_id, interest_name)
VALUES ('8986e508-66d3-4bb6-b3be-b435457db389', 'Journaling');
INSERT INTO interest (interest_id, interest_name)
VALUES ('cf2d01be-181f-43f8-bb18-e786c0ea1f3a', 'Origami');
INSERT INTO interest (interest_id, interest_name)
VALUES ('62d5eaeb-fc70-4c48-90d2-02e0c7595e07', 'Calligraphy');
INSERT INTO interest (interest_id, interest_name)
VALUES ('eeb42180-c1f4-438c-a39f-51a282b23f5f', 'Makeup Artistry');
INSERT INTO interest (interest_id, interest_name)
VALUES ('65c8999a-2320-4e6e-87fc-e0498577c64e', 'Interior Design');
INSERT INTO interest (interest_id, interest_name)
VALUES ('07e2d8b7-66b3-441f-bde4-e0de4f9797c0', 'Architecture');
INSERT INTO interest (interest_id, interest_name)
VALUES ('42d8cf0a-1ac4-4dc1-a1ec-d02e0bc1171e', 'Astronomy');
INSERT INTO interest (interest_id, interest_name)
VALUES ('2f23228b-1e12-4ff9-bf1f-1f73b0c1740f', 'Astrology');
INSERT INTO interest (interest_id, interest_name)
VALUES ('44f5083a-bbfe-4c2d-a4d4-f83fe251f0b2', 'Bird Watching');
INSERT INTO interest (interest_id, interest_name)
VALUES ('f8622c1e-f458-4ea0-b0e4-c929020bb118', 'Wine Tasting');
INSERT INTO interest (interest_id, interest_name)
VALUES ('0dfd41ac-b7ce-4c1b-9a35-df2fce6e2677', 'Beer Brewing');
INSERT INTO interest (interest_id, interest_name)
VALUES ('3eb0241c-e6a2-412e-bc8f-e964b0a35f4d', 'Mixology');
INSERT INTO interest (interest_id, interest_name)
VALUES ('6a5e5c7c-32dc-4a77-84c1-77a556f84ad8', 'Thrifting');
INSERT INTO interest (interest_id, interest_name)
VALUES ('b8c3cafd-63ae-4a70-881b-4cc807f51879', 'Fashion');
INSERT INTO interest (interest_id, interest_name)
VALUES ('bb69e053-3ebc-4303-9b4b-7cf6a3c2c7de', 'Modeling');
INSERT INTO interest (interest_id, interest_name)
VALUES ('3137e149-01d4-4b1c-a7ff-e9d937a3a93b', 'Collecting');
INSERT INTO interest (interest_id, interest_name)
VALUES ('fc81a51c-73cf-41f2-81dc-2ae5f06f6255', 'Vinyl Records');
INSERT INTO interest (interest_id, interest_name)
VALUES ('ef8cf11e-d88e-4a28-ae09-1fa0e52accc4', 'Antiquing');
INSERT INTO interest (interest_id, interest_name)
VALUES ('bb5be601-2b78-4403-bef4-2fa9927086c2', 'Sneaker Culture');
INSERT INTO interest (interest_id, interest_name)
VALUES ('d2e4fc3e-7782-4293-8898-9f5f60a2e7e4', 'Cosplay');
INSERT INTO interest (interest_id, interest_name)
VALUES ('3b2ea6aa-748e-4d93-966f-9bde3706e507', 'LARPing');
INSERT INTO interest (interest_id, interest_name)
VALUES ('11fc8a08-5f38-4cf8-b63c-6496b02f51cb', 'Anime');
INSERT INTO interest (interest_id, interest_name)
VALUES ('8ec91ab9-8f7e-4353-ac37-d36c81aee2f5', 'Manga');
INSERT INTO interest (interest_id, interest_name)
VALUES ('aa7797fe-787e-4821-bce0-e8abf65a8df0', 'Comic Books');
INSERT INTO interest (interest_id, interest_name)
VALUES ('e1dba02a-38c4-4279-b9d1-fa9769d4e812', 'Esports');
INSERT INTO interest (interest_id, interest_name)
VALUES ('f045a7df-0c4a-405e-8ea7-3510f63afd37', 'Twitch Streaming');
INSERT INTO interest (interest_id, interest_name)
VALUES ('a49b2126-6a61-42fe-a29f-617cc251dfcd', 'YouTube Creation');
INSERT INTO interest (interest_id, interest_name)
VALUES ('2a716ae0-36a3-4b68-b64a-ff58aefc02cb', 'Blogging');
INSERT INTO interest (interest_id, interest_name)
VALUES ('fd6a8ae2-7c1b-48e2-a858-399fc0774c5a', 'Vlogging');
INSERT INTO interest (interest_id, interest_name)
VALUES ('34b299e3-4871-4e8f-8141-44e1a8cf4c70', 'Public Speaking');
INSERT INTO interest (interest_id, interest_name)
VALUES ('3d272024-babb-48ec-ade9-2215a735e9e1', 'Volunteering');
INSERT INTO interest (interest_id, interest_name)
VALUES ('e7fd39fc-bbd3-4fc6-b1d1-dbc2b2ea15c4', 'Animal Rescue');
INSERT INTO interest (interest_id, interest_name)
VALUES ('03785bba-3370-42a0-9624-ec4ab881be35', 'Pet Training');
INSERT INTO interest (interest_id, interest_name)
VALUES ('63bd61ec-df10-47b5-8d9b-bb7a78024d6f', 'Horseback Riding');
INSERT INTO interest (interest_id, interest_name)
VALUES ('b866b2f2-bc62-4e4b-8823-770ec70d6832', 'Sailing');
INSERT INTO interest (interest_id, interest_name)
VALUES ('5e2a643d-326e-41df-b8c4-0fa345d12310', 'Fishing');
INSERT INTO interest (interest_id, interest_name)
VALUES ('55ff80ed-2e3a-4a61-a460-dfd43b1ec299', 'Hunting');
INSERT INTO interest (interest_id, interest_name)
VALUES ('8793a6ce-7f4c-4d4d-97b2-18060e4d7388', 'Camping');
INSERT INTO interest (interest_id, interest_name)
VALUES ('d68d88aa-22e3-4c39-a457-40e63ee664a2', 'Glamping');
INSERT INTO interest (interest_id, interest_name)
VALUES ('498c5fc3-45e6-4b4f-9a79-80c4caa99b94', 'Van Life');
INSERT INTO interest (interest_id, interest_name)
VALUES ('2d5e3b4a-56cd-4955-88d2-fb95fbd02a19', 'Road Trips');
INSERT INTO interest (interest_id, interest_name)
VALUES ('f2a89de5-6226-44de-a1cf-7c930ecb87eb', 'Stargazing');
INSERT INTO interest (interest_id, interest_name)
VALUES ('22bb2d88-0e44-4e8d-83a7-5d67df9a5d42', 'Puzzle Solving');
INSERT INTO interest (interest_id, interest_name)
VALUES ('b14b152d-63ee-4201-8f26-340e40703c25', 'Escape Rooms');
INSERT INTO interest (interest_id, interest_name)
VALUES ('b7336482-f029-4c82-a487-04eb93eec85c', 'Magic the Gathering');
INSERT INTO interest (interest_id, interest_name)
VALUES ('4068b7dc-930d-40f7-bc93-2365b0d29cd0', 'Dungeons & Dragons');
INSERT INTO interest (interest_id, interest_name)
VALUES ('982cdf90-e6ea-4a5d-8c63-c5c7d737c33d', 'Tarot Reading');
INSERT INTO interest (interest_id, interest_name)
VALUES ('2e9c1b1c-3dfc-47d9-b464-64d39ad71d5e', 'Crystals & Healing');
INSERT INTO interest (interest_id, interest_name)
VALUES ('df9ef01e-cd86-49a4-b66e-95b155861b00', 'Language Learning');
INSERT INTO interest (interest_id, interest_name)
VALUES ('c872deee-285b-4c5e-80a5-c8aa22c18e79', 'Sign Language');
INSERT INTO interest (interest_id, interest_name)
VALUES ('6a3ec5d0-e57b-48cd-a927-e1bcddbb9143', 'Debate');
INSERT INTO interest (interest_id, interest_name)
VALUES ('7e1f1cd7-2b3a-4bc1-9a0f-d3d155c5b122', 'Politics');
INSERT INTO interest (interest_id, interest_name)
VALUES ('ae126a1e-4f7c-43be-80fd-e3f356ec7399', 'Economics');
INSERT INTO interest (interest_id, interest_name)
VALUES ('b6f7c04d-74c6-4e68-bbde-38230e2ad5e7', 'Finance');
INSERT INTO interest (interest_id, interest_name)
VALUES ('b3828d21-749c-4056-b170-eae0d1c0eeb2', 'Investing');
INSERT INTO interest (interest_id, interest_name)
VALUES ('225844f0-33c5-45ef-943e-bc1ce4d3f597', 'Real Estate');
INSERT INTO interest (interest_id, interest_name)
VALUES ('bd9e35c7-3e02-4b5c-b64e-285041f80b63', '3D Printing');
INSERT INTO interest (interest_id, interest_name)
VALUES ('98650fa4-3052-4de8-a4db-c68eac7e2a2d', 'Woodworking');
INSERT INTO interest (interest_id, interest_name)
VALUES ('5ae26554-5745-4ec8-bdcb-1c54a8b7115c', 'Blacksmithing');
INSERT INTO interest (interest_id, interest_name)
VALUES ('d0a845be-ea9e-4e90-b8aa-f5f499b44867', 'Leathercraft');
INSERT INTO interest (interest_id, interest_name)
VALUES ('3c2328ae-93f3-4db5-a901-92d36ae05e3c', 'Tattoo Art');
INSERT INTO interest (interest_id, interest_name)
VALUES ('9b3109db-38bb-487b-b3a5-76560e56d7dc', 'Piercing');
INSERT INTO interest (interest_id, interest_name)
VALUES ('0bfe96b0-7005-4c5a-9c0d-8d6b6c65bdc1', 'Spirituality');
INSERT INTO interest (interest_id, interest_name)
VALUES ('206bdee3-b126-4e06-b87d-0fa31ab01ff8', 'Martial Arts');
INSERT INTO interest (interest_id, interest_name)
VALUES ('a79fe3bc-f2e4-4f6b-937e-7303e91604fb', 'Boxing');
INSERT INTO interest (interest_id, interest_name)
VALUES ('4c55f942-5a29-4638-b82b-74ce1d884cb0', 'Kickboxing');
INSERT INTO interest (interest_id, interest_name)
VALUES ('b149a92b-88cb-4b4a-a61e-e55b1e71d491', 'Parkour');
INSERT INTO interest (interest_id, interest_name)
VALUES ('ef77d210-c336-4ad7-bb6d-773bd9828e6e', 'Jiu-Jitsu');
INSERT INTO interest (interest_id, interest_name)
VALUES ('8d83a139-2ef4-48ae-bdd1-b37e9b1d33db', 'Muay Thai');
INSERT INTO interest (interest_id, interest_name)
VALUES ('c5aef1c4-cc4e-4a24-8947-69a34f310c5f', 'Wrestling');
INSERT INTO interest (interest_id, interest_name)
VALUES ('dc2511f2-8ef8-4c39-bfc7-01c31b00b18e', 'Self-Defense');
INSERT INTO interest (interest_id, interest_name)
VALUES ('d49f4f95-9aa5-4694-8c6a-c35a5b97dced', 'Zumba');
INSERT INTO interest (interest_id, interest_name)
VALUES ('f8b17729-d7c9-41aa-bf80-38c0dc154d50', 'CrossFit');
INSERT INTO interest (interest_id, interest_name)
VALUES ('29b16852-4ef0-402b-8232-01df72340343', 'Pilates');
INSERT INTO interest (interest_id, interest_name)
VALUES ('bbcc3037-b918-4d66-98cb-b3df20f7f88e', 'Barre');
INSERT INTO interest (interest_id, interest_name)
VALUES ('aa2c3ab1-9e90-4f67-9c3e-d8818b9f6ce5', 'Spin Class');
INSERT INTO interest (interest_id, interest_name)
VALUES ('bd5193c9-f2c2-474f-b019-e83d87b5eb2a', 'Bodybuilding');
INSERT INTO interest (interest_id, interest_name)
VALUES ('0d8b4e0e-5889-4c36-825d-b7f585a8a664', 'Powerlifting');
INSERT INTO interest (interest_id, interest_name)
VALUES ('2331f0dc-5746-4972-a27b-d5b64b3b703d', 'Biohacking');
INSERT INTO interest (interest_id, interest_name)
VALUES ('0ea16916-2550-4986-9f35-b95a12a7cc54', 'Nutrition');
INSERT INTO interest (interest_id, interest_name)
VALUES ('fb214a8c-c93a-4c0a-9014-d8d9f12bb9d2', 'Veganism');
INSERT INTO interest (interest_id, interest_name)
VALUES ('a0cc71f7-33e7-4be4-b764-6e5a9e5e2ee1', 'Vegetarianism');
INSERT INTO interest (interest_id, interest_name)
VALUES ('f6f6a847-c5cc-4445-ae4a-39795cd04e13', 'Baking');
INSERT INTO interest (interest_id, interest_name)
VALUES ('1f84ed67-3aa8-4e42-8735-b5c7f6dfaf16', 'Barbecue');
INSERT INTO interest (interest_id, interest_name)
VALUES ('62d13cb7-0040-4d43-80b4-9ffbcdb387cc', 'Fermenting');
INSERT INTO interest (interest_id, interest_name)
VALUES ('55bc6765-5d2a-4219-8f7f-498a84449c06', 'Food Blogging');
INSERT INTO interest (interest_id, interest_name)
VALUES ('ee21a567-ec93-4f42-b9bc-1e90a9b6d008', 'Food Photography');
INSERT INTO interest (interest_id, interest_name)
VALUES ('a617d114-2e82-4f91-aea2-030208d2a2b5', 'Tea Tasting');
INSERT INTO interest (interest_id, interest_name)
VALUES ('27320756-c0a0-4c4d-8cb6-2ab5b6894f4a', 'Coffee Brewing');
INSERT INTO interest (interest_id, interest_name)
VALUES ('2d6a2216-60c0-448e-b4a7-efae6d897ae3', 'Candle Making');
INSERT INTO interest (interest_id, interest_name)
VALUES ('b5a77e46-6f89-4a1b-bd01-c5861f171779', 'Soap Making');
INSERT INTO interest (interest_id, interest_name)
VALUES ('ca8a17c3-ea9f-4e97-92f4-4a431d258b37', 'Resin Art');
INSERT INTO interest (interest_id, interest_name)
VALUES ('e3e85c9e-7f16-40c4-b8b4-8d650ebf0f6e', 'Sculpting');
INSERT INTO interest (interest_id, interest_name)
VALUES ('b3c48ef2-b4be-49b3-8973-75fc6b40cba4', 'Glass Blowing');
INSERT INTO interest (interest_id, interest_name)
VALUES ('d2e0a8bb-d6f9-4d32-bf90-f55aa8e7682d', 'Pottery');
INSERT INTO interest (interest_id, interest_name)
VALUES ('be75cb8b-e4a6-4686-81f1-e8a1e5a347db', 'Ceramics');

-- (continues...)
INSERT INTO user_interest (user_interest_interest_id, user_interest_user_id)
VALUES ('019837fd-b294-7db7-9de3-320d4078618c', '01991b2b-e52e-721b-b43b-519b6babd008'),
       ('019837fd-b294-7b32-987d-d40fbfb8f19b', '01991b2b-e52e-721b-b43b-519b6babd008'),
       ('019837fd-b294-751d-b90d-e70a3458bfc5', '01991b2b-e52e-721b-b43b-519b6babd008'),
       ('019837fd-b294-7952-b1e5-a345a56da742', '01991b2b-e52e-79db-986e-4199ab65a3f9'),
       ('019837fd-b294-7dfb-bb83-89186745ad30', '01991b2b-e52e-79db-986e-4199ab65a3f9'),
       ('019837fd-b294-761b-8b88-7e82cd4beea0', '01991b2b-e52e-79db-986e-4199ab65a3f9'),
       ('019837fd-b294-7f75-868e-991859349e2f', '01991b2b-e52e-715a-817a-7a93cca5f49e'),
       ('019837fd-b294-71c1-9c30-ae2f273b263c', '01991b2b-e52e-715a-817a-7a93cca5f49e'),
       ('019837fd-b294-7ac8-bdde-48624f423083', '01991b2b-e52e-715a-817a-7a93cca5f49e'),
       ('019837fd-b294-73c9-9bb7-c1994b9e74ef', '01991b2b-e52e-722a-9aa9-8be5cc790852'),
       ('019837fd-b294-791f-9f8f-c45c2a90d9fc', '01991b2b-e52e-722a-9aa9-8be5cc790852'),
       ('019837fd-b294-7168-a762-78baab3d49b6', '01991b2b-e52e-722a-9aa9-8be5cc790852'),
       ('019837fd-b294-7eec-82d7-90935dc36e5e', '019910e9-b3b2-722c-8559-c0fda3f89702'),
       ('019837fd-b294-7bf5-90f1-8c88edc8660e', '019910e9-b3b2-722c-8559-c0fda3f89702'),
       ('019837fd-b294-723e-9597-af52fe0323bf', '019910e9-b3b2-722c-8559-c0fda3f89702'),
       ('019837fd-b294-7368-804c-cbe253bd3f0f', '01991b2b-e52e-74a3-8104-9dde9a423cb8'),
       ('019837fd-b294-706a-86ef-e830d2918d5e', '01991b2b-e52e-74a3-8104-9dde9a423cb8'),
       ('019837fd-b294-7ac4-ac35-6a9256b8b51d', '01991b2b-e52e-74a3-8104-9dde9a423cb8'),
       ('019837fd-b294-7621-805d-cca7e9a6a31b', '01991b2b-e52e-75a5-8b1f-c5b84c531445'),
       ('019837fd-b294-7d6c-abb3-35f9f134b8b0', '01991b2b-e52e-75a5-8b1f-c5b84c531445'),
       ('019837fd-b294-79b2-be3c-f97403ed45c8', '01991b2b-e52e-75a5-8b1f-c5b84c531445'),
       ('019837fd-b294-7c3b-9e20-1777db6bf461', '01991b0b-38a6-7375-a61e-3a60848da8f3'),
       ('019837fd-b294-76dd-8a2c-70995f81f6b7', '01991b0b-38a6-7375-a61e-3a60848da8f3'),
       ('019837fd-b294-7ea9-acda-9fa3ae627685', '01991b0b-38a6-7375-a61e-3a60848da8f3'),
       ('019837fd-b294-7339-8d52-17f2b2560bd6', '01991b2b-e52e-7dda-9cfc-c748e09044e0'),
       ('019837fd-b294-7f00-8f29-86a110bb1b32', '01991b2b-e52e-7dda-9cfc-c748e09044e0'),
       ('019837fd-b294-7951-b6fd-810279618fd9', '01991b2b-e52e-7dda-9cfc-c748e09044e0'),
       ('ad238ad4-dbb1-4e7b-8324-a9279bdcce46', '01991b2b-e52e-79d2-95ae-cb0c1d3e817a'),
       ('afe4d25d-d591-48c6-9fc3-35ecf99d320f', '01991b2b-e52e-79d2-95ae-cb0c1d3e817a'),
       ('1ab01078-3880-4b7c-a8a2-48075be1395b', '01991b2b-e52e-79d2-95ae-cb0c1d3e817a'),
       ('c249d9e1-3722-4797-8203-00e22b98c240', '01991b2b-e52e-77a6-b19e-41c657ddbe47'),
       ('785f6b1d-f07e-49e6-877e-c6c11651c3b4', '01991b2b-e52e-77a6-b19e-41c657ddbe47'),
       ('dfba02fc-2fe9-498f-81e7-26a5d58e620e', '01991b2b-e52e-77a6-b19e-41c657ddbe47'),
       ('8986e508-66d3-4bb6-b3be-b435457db389', '01991b2b-e52e-758c-89d9-748624861e1d'),
       ('cf2d01be-181f-43f8-bb18-e786c0ea1f3a', '01991b2b-e52e-758c-89d9-748624861e1d'),
       ('62d5eaeb-fc70-4c48-90d2-02e0c7595e07', '01991b2b-e52e-758c-89d9-748624861e1d'),
       ('eeb42180-c1f4-438c-a39f-51a282b23f5f', '01991b2b-e52e-7d54-aa44-c55e022f459d'),
       ('65c8999a-2320-4e6e-87fc-e0498577c64e', '01991b2b-e52e-7d54-aa44-c55e022f459d'),
       ('07e2d8b7-66b3-441f-bde4-e0de4f9797c0', '01991b2b-e52e-7d54-aa44-c55e022f459d'),
       ('42d8cf0a-1ac4-4dc1-a1ec-d02e0bc1171e', '01991b2b-e52e-7176-a954-24565b25955b'),
       ('2f23228b-1e12-4ff9-bf1f-1f73b0c1740f', '01991b2b-e52e-7176-a954-24565b25955b'),
       ('44f5083a-bbfe-4c2d-a4d4-f83fe251f0b2', '01991b2b-e52e-7176-a954-24565b25955b'),
       ('f8622c1e-f458-4ea0-b0e4-c929020bb118', '01991b2b-e52e-7114-b004-20d27a94798b'),
       ('0dfd41ac-b7ce-4c1b-9a35-df2fce6e2677', '01991b2b-e52e-7114-b004-20d27a94798b'),
       ('3eb0241c-e6a2-412e-bc8f-e964b0a35f4d', '01991b2b-e52e-7114-b004-20d27a94798b'),
       ('6a5e5c7c-32dc-4a77-84c1-77a556f84ad8', '01991b2b-e52e-778b-b8d8-648ee7c89949'),
       ('b8c3cafd-63ae-4a70-881b-4cc807f51879', '01991b2b-e52e-778b-b8d8-648ee7c89949'),
       ('bb69e053-3ebc-4303-9b4b-7cf6a3c2c7de', '01991b2b-e52e-778b-b8d8-648ee7c89949'),
       ('3137e149-01d4-4b1c-a7ff-e9d937a3a93b', '01991b2b-e52e-717a-9cac-30a952f42023'),
       ('fc81a51c-73cf-41f2-81dc-2ae5f06f6255', '01991b2b-e52e-717a-9cac-30a952f42023'),
       ('ef8cf11e-d88e-4a28-ae09-1fa0e52accc4', '01991b2b-e52e-717a-9cac-30a952f42023'),
       ('bb5be601-2b78-4403-bef4-2fa9927086c2', '01991b2b-e52e-7176-a358-b65ca4e15eb8'),
       ('d2e4fc3e-7782-4293-8898-9f5f60a2e7e4', '01991b2b-e52e-7176-a358-b65ca4e15eb8'),
       ('3b2ea6aa-748e-4d93-966f-9bde3706e507', '01991b2b-e52e-7176-a358-b65ca4e15eb8'),
       ('11fc8a08-5f38-4cf8-b63c-6496b02f51cb', '01991b2b-e52e-7b5b-8ca4-c4ba5a873790'),
       ('8ec91ab9-8f7e-4353-ac37-d36c81aee2f5', '01991b2b-e52e-7b5b-8ca4-c4ba5a873790'),
       ('aa7797fe-787e-4821-bce0-e8abf65a8df0', '01991b2b-e52e-7b5b-8ca4-c4ba5a873790'),
       ('e1dba02a-38c4-4279-b9d1-fa9769d4e812', '01991b2b-e52e-7cd0-a837-c7d357fd4569'),
       ('f045a7df-0c4a-405e-8ea7-3510f63afd37', '01991b2b-e52e-7cd0-a837-c7d357fd4569'),
       ('a49b2126-6a61-42fe-a29f-617cc251dfcd', '01991b2b-e52e-7cd0-a837-c7d357fd4569'),
       ('2a716ae0-36a3-4b68-b64a-ff58aefc02cb', '01991b2b-e52e-7798-96c2-53ba34be4fe9'),
       ('fd6a8ae2-7c1b-48e2-a858-399fc0774c5a', '01991b2b-e52e-7798-96c2-53ba34be4fe9'),
       ('34b299e3-4871-4e8f-8141-44e1a8cf4c70', '01991b2b-e52e-7798-96c2-53ba34be4fe9'),
       ('3d272024-babb-48ec-ade9-2215a735e9e1', '01991b2b-e52e-75ca-be14-9d8a07c56931'),
       ('e7fd39fc-bbd3-4fc6-b1d1-dbc2b2ea15c4', '01991b2b-e52e-75ca-be14-9d8a07c56931'),
       ('03785bba-3370-42a0-9624-ec4ab881be35', '01991b2b-e52e-75ca-be14-9d8a07c56931');
