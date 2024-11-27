## Setting Up the Project

1. Clone the repository:
```bash
   git clone https://github.com/fasihh/PAI_Project
   cd PAI_Project
```

2. Create a virtual environment
```bash
python -m venv venv
```

3. Activate virtual environment
```bash
venv\Scripts\activate
```

4. Install dependencies
```bash
pip install -r requirements.txt
```

5. Make a separate `.env` file from `.env.example`.

6. To start the server, you must first generate all the images:
```bash
py generate_images.py

# Then run the server using
fastapi dev app.py
```

7. Open a new terminal. Then run the following command:
```bash
npm install
```

8. To start the front-end:
```bash
npm run start
```

9. To deactivate virtual environment
```bash
deactivate
```
