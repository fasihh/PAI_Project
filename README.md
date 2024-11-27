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

5. To start the server, you must first generate all the images:
```bash
make generate_images
```
Then run the server using:
```bash
make run_api
```
You can do both using:
```bash
make run
```

6. To deactivate virtual environment
```bash
deactivate
```
