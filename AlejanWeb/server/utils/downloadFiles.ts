import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const  exportPDF = async (data:any) => {
  
    const doc = new jsPDF('l');
    const dataColumns = generateDataColumns(data)
  
    autoTable(doc, {
      body:data,  
      columns:dataColumns,
      headStyles: { fillColor: "#4318ff" },
      margin: { top: 25 },
      theme: 'grid',
      didDrawPage: function () {
        // Header
        doc.setFontSize(25);
        var fileTitle = "Report";
        doc.text(fileTitle, 130, 20);
        doc.setFontSize(20);
        var date = dayjs().format('MM/DD/YYYY hh:mm A');
        doc.text(date, 225, 20);
        // var img = "/img/logo-svg.png"; //use addImage as explained earlier.
        // doc.addImage(img, 'PNG', 14, 10, 65, 12);
      }
    });

    const pdfBlob = doc.output('blob');
    return Buffer.from(await pdfBlob.arrayBuffer());
};

const generateDataColumns = (data: any) => {
  if (data.length === 0) return [];
  const keys = Object.keys(data[0]);
  return keys.map(key => ({ header: key, dataKey: key }));
};