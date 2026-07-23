from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet



def generate_ai_report_pdf(
        filepath,
        patient_summary,
        lab_explanation,
        nutrition,
        lifestyle,
        doctor_points,
        disclaimer
):

    document = SimpleDocTemplate(
        filepath,
        pagesize=letter
    )


    styles = getSampleStyleSheet()


    content = []


    title = Paragraph(
        "NutriScan AI - Health Summary Report",
        styles["Title"]
    )

    content.append(title)

    content.append(
        Spacer(1,20)
    )



    sections = [

        (
            "Patient Summary",
            patient_summary
        ),

        (
            "Lab Explanation",
            lab_explanation
        ),

        (
            "Nutrition Suggestions",
            nutrition
        ),

        (
            "Lifestyle Guidance",
            lifestyle
        ),

        (
            "Doctor Discussion Points",
            doctor_points
        ),

        (
            "Medical Disclaimer",
            disclaimer
        )

    ]



    for heading, text in sections:


        content.append(

            Paragraph(
                heading,
                styles["Heading2"]
            )

        )


        content.append(

            Paragraph(
                text.replace("\n","<br/>"),
                styles["BodyText"]
            )

        )


        content.append(

            Spacer(
                1,
                15
            )

        )



    document.build(content)