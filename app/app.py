from flask import Flask, render_template, request, redirect, flash
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

app.secret_key = "nutriscan_secret_key"

# Upload Folder
UPLOAD_FOLDER = os.path.join(app.static_folder, "uploads")
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Allowed Extensions
ALLOWED_EXTENSIONS = {"pdf"}

# Home Page
@app.route("/")
def home():
    return render_template("index.html")

# Check PDF
def allowed_file(filename):
    return "." in filename and \
           filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# Upload Page
@app.route("/upload", methods=["GET", "POST"])
def upload():

    if request.method == "POST":

        # File selected?
        if "report" not in request.files:
            flash("Please select a PDF file.")
            return redirect(request.url)

        file = request.files["report"]

        # Empty filename?
        if file.filename == "":
            flash("No file selected.")
            return redirect(request.url)

        # Validate PDF
        if file and allowed_file(file.filename):

            filename = secure_filename(file.filename)

            save_path = os.path.join(
                app.config["UPLOAD_FOLDER"],
                filename
            )

            file.save(save_path)

            flash("Blood Report uploaded successfully!")

            return redirect("/upload")

        else:

            flash("Only PDF files are allowed.")

            return redirect(request.url)

    return render_template("upload.html")


if __name__ == "__main__":
    app.run(debug=True)