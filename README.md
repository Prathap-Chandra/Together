# Together 

Created simple APIs for creating meeting rooms, blocking rooms on specific dates and updating them
## Getting Started

### Installing

Steps to run the app
```
git clone https://github.com/Prathap-Chandra/together.git
cd together/
npm start
```

## Usage
- [Postman Collection](https://www.google.com)
- [A Simple 4 mins video explaining the APIs flow](https://www.google.com)

## APIs
- Get the list of Existing Meeting Rooms
```
curl --location --request GET 'http://localhost:3000/v1.0/rooms/add'
```

- Create a new Meeting Room
- Please make sure that name should be unique
- You can use the above API to get the existing meeting rooms and their names so that there will be no conflict
```
curl --request POST 'http://localhost:3000/v1.0/rooms/add' \
--header 'Content-Type: application/json' \
--data-raw ' {
   "name": "Eight",
   "numberOfSeats": 12,
   "floorNumber": "1st Floor",
   "whiteboard": true,
   "roomPic": "https://s3.ap-south1.amazonaws.com/2gethrteam/building/5c41bcd803a72132b4fe08e3/objects/image-5f7ad3eb-a7df-4bbf-9680-cbdc9febdf99.jpg",
   "conference_cost_in_credits": 2
 }'
```

- Get List of Booked Meeting Rooms
```
curl --request GET 'http://localhost:3000/v1.0/rooms/book'
```

- Book a Meeting room
- Use the 1st API to get the roomIds to block the Room
```
curl --location --request POST 'http://localhost:3000/v1.0/rooms/book' \
--header 'Content-Type: application/json' \
--data-raw '{
  "roomId": "5ea91c2ecd142f33d603fc37",
  "dateToBook": "26-05-2019",
  "slotsRequired": [1,2,3,5,6,7,8,9,12,15,16,18],
  "userName": "Aditi"
}'
```

## Built With

* [mLab](https://mlab.com/) - Database

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc