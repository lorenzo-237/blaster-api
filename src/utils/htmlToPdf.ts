import puppeteer, { PDFOptions } from 'puppeteer';

const defaultOptions: PDFOptions = {
  format: 'A4',
  printBackground: true,
  margin: {
    top: '50px',
    right: '50px',
    bottom: '50px',
    left: '50px',
  },
  displayHeaderFooter: true,
  headerTemplate: '<div/>',
  footerTemplate:
    '<div style="text-align: right;width: 297mm;font-size: 12px;"><span style="margin-right: 1cm"><span class="pageNumber"></span> sur <span class="totalPages"></span></span></div>',
};

// for the footer :
// https://github.com/puppeteer/puppeteer/issues/5345

async function htmlToPdf(html: string, options = defaultOptions) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'domcontentloaded' });

  const pdfBuffer = await page.pdf(options);

  return pdfBuffer;
}

export default htmlToPdf;
