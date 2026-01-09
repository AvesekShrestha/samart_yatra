# Smart Yatra

Smart Yatra is a web-based platform aimed at digitalizing and centralizing Nepal’s public bus transportation system under government regulation. It replaces unmanaged, cash-based operations with a transparent, technology-driven model.

## Problems 

* Public buses are unmanaged and decentralized
* Operations are controlled by individual drivers or groups
* Fare calculation is inconsistent and unregulated
* Cash-based fare collection lacks transparency and accountability
* No reliable system for real-time bus tracking

## Solutions

* Centralized transport management under the Government of Nepal
* Digitized route, vehicle, and bus stop management
* Automated distance-based fare calculation
* Cashless payments through Khalti to a centralized government account
* Real-time GPS-based bus tracking for passengers

## Working

* Admin (government authority) manages routes, vehicles, bus stops, and approves riders
* Riders share live GPS location of buses on assigned routes
* Passengers view routes and track buses in real time on a map
* Riders generate dynamic QR codes for passenger entry and exit
* Passenger scans QR on entry and exit
* System calculates distance using OSRM API and computes fare
* Payment is completed digitally via Khalti

## Impact 

* Improved transparency and accountability in public transport
* Fair and consistent fare calculation
* Reduced cash handling and revenue leakage
* Better passenger experience through live tracking
* Stronger government control and data-driven transport planning

## Installation & Setup

### Prerequisites

* docker
* docker compose
* git
* node

### Steps 

1. Clone the repository

```
git clone https://github.com/AvesekShrestha/samart_yatra
cd samart_yatra
```

2. Configure environment variables

* Create .env files for backend and frontend if required
* Update database credentials, API keys (Khalti, OSRM), and socket URLs

3. Run backend

```
docker compose up --build
```

4. Run frontend 

```
npm run dev
```


