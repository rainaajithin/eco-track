**Project Title: Eco-Track** - Smart Carbon & Time Tracker

**Theme: Digital Sustainability**

EcoTrack is a powerful Chrome Extension that helps users monitor their digital carbon footprint and manage time spent on distracting websites. It combines real-time CO₂ tracking, productivity analytics, and visual dashboards to promote eco-conscious browsing and healthier screen habits.

**The Problem**
EcoBrowse addresses two major digital lifestyle challenges:

🌍 Rising carbon footprint from internet usage
The internet is responsible for approximately 3.7% of global greenhouse gas emissions. However, because digital data is "invisible," most users have no idea how much carbon they are producing while browsing.  Video streaming and heavy websites use massive amounts of energy at data centers, but there is currently no easy way for a user to monitor or manage this "digital footprint" in real-time.

⏳ Excessive time spent on distracting websites
Most users do not realize how much time they waste and loose productivity. This gives self awareness. 

**Techs used**: It is a JavaScript-based Chrome Extension for data capture and a Tailwind CSS/Chart.js dashboard for visualization.

**Features**

Eco-Track is a Chrome Extension and Dashboard that makes the invisible carbon cost of the web visible. It uses open network data to educate users and provide actionable tools to reduce their impact.
- Real-time Monitoring: Tracks data transfer (MBs) per website visited.
- Carbon Conversion: Uses industry-standard formulas to convert data usage into CO2 grams.

**Carbon Footprint Tracking**
- Tracks estimated CO₂ emissions per website
- Displays Top Daily Emitters
- Shows Weekly CO₂ Trends
- Provides Carbon Grade Scale (A–F)

**Time Spent**
- Tracks time spent on distracting sites like YouTube, Instagram, Facebook, Twitter, Reddit, Netflix
- Displays daily time spent chart
- Weekly Time Trend
- Category-wise Time Distribution (Doughnut Chart)

Popup for CO2 tracking:
<img width="1359" height="730" alt="image" src="https://github.com/user-attachments/assets/819cf262-2db6-469a-9130-bd6a8acccbef" />

Dashboard:
<img width="980" height="618" alt="image" src="https://github.com/user-attachments/assets/4d77a6d2-df18-4f61-9aaf-ddfa5bf96097" />
<img width="1325" height="441" alt="image" src="https://github.com/user-attachments/assets/50efb1a0-a295-4a13-bda5-062696b8d4f4" />

Popup for time spent:
<img width="1358" height="730" alt="image" src="https://github.com/user-attachments/assets/68ea454c-f585-4e8b-b34d-c05c066808ef" />

Dashboard
<img width="993" height="611" alt="image" src="https://github.com/user-attachments/assets/2fd0b137-8525-4d01-9fa9-33aa7745497c" />
<img width="1321" height="349" alt="image" src="https://github.com/user-attachments/assets/aebfebec-de30-4b39-a04c-3c3aac19b23e" />


**Installation**
1. Download or clone the repository
git clone https://github.com/your-username/ecobrowse.git
2. Open Chrome and go to
- chrome://extensions
- Enable Developer Mode (top-right corner)
- Click Load unpacked
- Select the project folder
3. EcoBrowse extension is now installed



https://github.com/user-attachments/assets/2d19fc18-40da-48b8-ba3a-dcac0ea13f1e



**Architecture:**

**Data flow:**


<img width="309" height="270" alt="image" src="https://github.com/user-attachments/assets/b9672f84-532e-47ca-8cb9-50f42d87fd8c" />




_1. User Interface Layer (Frontend)_
This layer provides all visualo components and user interaction.
Components:
- dashboard.html
- popup.html
- dashboard.js
- popup.js
- chart.js

_2. Tracking Engine Layer_
- background.js

_3. Data Storage Layer (Chrome Local Storage)_
_4. Chrome Extension Platform Layer_
manifest.json
Chrome APIs:
- chrome.tabs
- chrome.storage
- chrome.runtime
- chrome.windows




**Developed by:**

Binary Ninjas
- Rainaa Anna Jithin
- Kathrin Anna James

**Browse responsibly, stay productive, and reduce digital environmental impact.**




