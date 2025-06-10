# Commonality
#### *Where People Who Aren't "People People" Meet People*

## Commonality connects users with common interests.
Commonality is not an events app or a meetup app. This app exists to help people find people in their area with similar interests, to get together and DO stuff.
- Love tennis, but don't have anyone to play with?
- Have a guitar, but nobody to jam with?
- Painted all your Warhammer pieces, but none of your friends care?
- Commonality helps you find people who share your interests so that you can have some fun.
  - Connecting individuals for 1-on-1 meetups, or smaller groups (up to 10 people) for larger activities.

This is different from meetup.com in that they do larger events at set times, and our app is about finding partners/pairs/groups for something without a strict schedule.
- E.g. finding a tennis partner, a gaming partner, a (small) group to hike with

### Profile-based
- Users create a profile and add interest tags to it
  - Name, age, photo, about me, and list of interests
  - "I want to meet people to: ___ play tennis, play Warhammer, discuss books, play music, do pottery, have craft days, whatever!"
- Commonality suggests other profiles of users with similar tags
- We want to implement a search for specific people, but also want to implement the ability to automatically
  pair individuals as well.
- Checkboxes on interests for absolute beginner or willing to mentor
- Message user option
    - Block/report user option

### Pairing
- You tell the app which of your interests to search for, and Commonality shows you profiles of people with that interest on their profile.
- Users can also see a list of people in their area with a specific shared interest
    - One-sided matching (not like tinder) where you can send a message to someone with shared interests
        - Can't message anyone who doesn't share at least 1 tag
- Suggested groups to message / suggested users to invite to your group
- NOT providing a big list for people - offering up profiles with the same specific interest.
- NOT an overall friend-finder app. Keeping it specific to the activity you want to do. If it leads to friendship, that's great.

### Groups
- *We still need to flesh out the differences between 1-on-1 connections and groups.*
- Once matches are made, it starts a group.
    - A user can specify if they want to find a singular person or multiple people for a specific search.
    - 1-on-1 matches will not make groups initially

    - Users can change max group sizes, or start a fresh group and invite people
    - Groups need an admin user to kick people / set group name / etc

### Communication
- Communication is facilitated through Commonality
  - Messaging system for 1-on-1 connections
  - Group messaging for groups
  - Date setting tool - with small calendar in-app but google calendar push as well
  - Polling for groups - take votes on best times to meet
- Account area will have list of your connections and a way to add/remove connections
- Steal thing from meetup.com that offers up mutual friends / friends with mutual interests to current connections

### 2 Main Functions:
- 1-on-1 connections (don't need polls, groups, etc)
- Groups of 3+ connections (more functionality required)