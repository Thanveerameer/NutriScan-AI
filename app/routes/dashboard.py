from flask import Blueprint
import os

from flask import send_file,request

from services.pdf_report_service import generate_ai_report_pdf


dashboard_bp = Blueprint(
    "dashboard",
    __name__
)



def parse_ai_response(ai_result):

    sections = {

        "patient_summary": "",
        "lab_explanation": "",
        "nutrition": "",
        "lifestyle": "",
        "doctor_points": "",
        "disclaimer": ""

    }


    current_section = None


    for line in ai_result.split("\n"):

        line = line.strip()


        if not line:
            continue



        if line.startswith("Patient Summary:"):

            current_section = "patient_summary"


        elif line.startswith("Lab Explanation:"):

            current_section = "lab_explanation"


        elif line.startswith("Nutrition Suggestions:"):

            current_section = "nutrition"


        elif line.startswith("Lifestyle Guidance:"):

            current_section = "lifestyle"


        elif line.startswith("Doctor Discussion Points:"):

            current_section = "doctor_points"


        elif line.startswith("Medical Disclaimer:"):

            current_section = "disclaimer"


        else:

            if current_section:

                sections[current_section] += line + "\n"



    return sections
@dashboard_bp.route("/download-report", methods=["POST"])
def download_report():


    data = request.form



    pdf_path = os.path.join(
        os.getcwd(),

        "static",

        "uploads",

        "NutriScan_AI_Report.pdf"

    )



    generate_ai_report_pdf(

        pdf_path,

        data.get("patient_summary",""),

        data.get("lab_explanation",""),

        data.get("nutrition",""),

        data.get("lifestyle",""),

        data.get("doctor_points",""),

        data.get("disclaimer","")

    )



    return send_file(

        pdf_path,

        as_attachment=True

    )