generate_images:
	py generate_images.py

run_api:
	fastapi dev app.py

run:
	generate_images run_api