# 💿 Vinyl Vault
**A high-fidelity physical media simulation for the modern web.**

---

## **🛠 The Tech Stack**
To satisfy the **Requirements** of the project, we utilized:

* [cite_start]**Frontend:** **React.js** for building a component-based UI[cite: 8].
* **Animations:** **Motion** for hardware-accurate physics simulations.
* **Styling:** **Tailwind CSS v4** for a utility-first, performant indie aesthetic.
* [cite_start]**Backend:** **Node.js/Next.js** API routes to handle RESTful data fetching[cite: 9].
* [cite_start]**Database:** Integrated with a real database (**MongoDB**) to serve album metadata[cite: 10].

---

## **🏗 System Architecture**
[cite_start]The application follows a standard **Frontend-Backend-Database** flow to ensure scalability and separation of concerns[cite: 23].



1.  [cite_start]**Client Layer:** React handles the state and triggers complex animations via Motion[cite: 23].
2.  [cite_start]**API Layer:** RESTful endpoints serve album metadata and asset paths[cite: 25].
3.  [cite_start]**Data Layer:** A database that ensures no mock data is used.[cite: 10].

---

## **🕹 Features**
* [cite_start]**Interactive Crate:** Browse high-res indie album art with custom hover effects[cite: 26].
* **Mechanical Simulation:** The tonearm physically swings onto the record when playback begins.
* **Dynamic Turntable:** Real-time rotation and CSS-generated vinyl grooves.
* **Hi-Fi Audio:** High-quality local `.wav` playback using the HTML5 Audio API.

---


## **🚀 Installation & Local Dev**
To set up the development environment locally:

```bash
# 1. Clone the repository
git clone [https://github.com/YOUR_USER/vinyl-vault.git](https://github.com/YOUR_USER/vinyl-vault.git)

# 2. Install core dependencies
npm install

# 3. Install project-specific plugins
npm install motion lucide-react @tailwindcss/vite tailwindcss

# 4. Start the development server
npm run dev
