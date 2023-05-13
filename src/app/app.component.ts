import { Component } from '@angular/core';
import { faker } from '@faker-js/faker';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public print(): void {
    console.log('print')
    const doc = new jsPDF();

    doc.setFontSize(18)
    doc.text('With content', 14, 22)
    doc.setFontSize(11)
    doc.setTextColor(100)

    // jsPDF 1.4+ uses getWidth, <1.4 uses .width
    var pageSize = doc.internal.pageSize
    var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth()
    var text = doc.splitTextToSize(faker.lorem.sentence(45), pageWidth - 35, {})
    doc.text(text, 14, 30)

    autoTable(doc, {
      head: this.headRows(),
      body: this.bodyRows(60),
      startY: 50,
      showHead: 'firstPage',
      foot: this.footRows(),
    });

    autoTable(doc, {
      body: this.generateSignatureContent(),
      bodyStyles: { halign: 'right' },
      theme: 'plain',
      pageBreak: 'avoid',
    });


    doc.text(text, 14, (doc as any).lastAutoTable.finalY + 10)

    console.log(doc.getNumberOfPages())

    doc.save('auto-print.pdf');
  }

  private generateSignatureContent() {
    const signatureContent = [];
    signatureContent.push(['Transferred by______________________']);
    signatureContent.push(['Received by______________________']);
    signatureContent.push(['Completed by______________________']);
    signatureContent.push(['Voided by______________________']);

    return signatureContent;
  }

  private headRows() {
    return [
      { id: 'ID', name: 'Name', email: 'Email', city: 'City', expenses: 'Sum' },
    ]
  }

  private footRows() {
    return [
      { id: 'ID', name: 'Name', email: 'Email', city: 'City', expenses: 'Sum' },
    ]
  }

  private columns() {
    return [
      { header: 'ID', dataKey: 'id' },
      { header: 'Name', dataKey: 'name' },
      { header: 'Email', dataKey: 'email' },
      { header: 'City', dataKey: 'city' },
      { header: 'Exp', dataKey: 'expenses' },
    ]
  }

  private bodyRows(rowCount: any) {
    rowCount = rowCount || 10
    var body = []
    for (var j = 1; j <= rowCount; j++) {
      body.push({
        id: j,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        city: faker.location.city(),
        expenses: faker.finance.amount(),
      })
    }
    return body
  }
}
