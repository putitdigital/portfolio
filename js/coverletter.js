const CoverLetter = {
    form: document.getElementById('coverLetterForm'),
    preview: document.getElementById('letterPreview')
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCoverLetterBuilder);
} else {
    initializeCoverLetterBuilder();
}

function initializeCoverLetterBuilder() {
    if (!CoverLetter.form || !CoverLetter.preview) {
        return;
    }

    setDefaultDate();
    initWorkedSinceVisibility();
    bindLivePreview();
    bindActions();
    renderPreview();
}

function setDefaultDate() {
    const dateInput = document.getElementById('letterDate');
    if (!dateInput) return;

    const today = new Date();
    const formatted = today.toISOString().split('T')[0];
    dateInput.value = formatted;
}

function bindLivePreview() {
    CoverLetter.form.querySelectorAll('input, textarea').forEach((field) => {
        field.addEventListener('input', renderPreview);
        field.addEventListener('change', renderPreview);
    });
}

function initWorkedSinceVisibility() {
    const companyInput = document.getElementById('currentCompany');
    const workedSinceField = document.getElementById('workedSinceField');
    const workedSinceInput = document.getElementById('workedSince');

    if (!companyInput || !workedSinceField || !workedSinceInput) {
        return;
    }

    function updateWorkedSinceVisibility() {
        const shouldHide = isTBWACompany(companyInput.value);
        workedSinceField.hidden = shouldHide;
        workedSinceInput.disabled = shouldHide;
        if (shouldHide) {
            workedSinceInput.removeAttribute('required');
        } else {
            workedSinceInput.setAttribute('required', 'required');
        }
    }

    companyInput.addEventListener('input', updateWorkedSinceVisibility);
    companyInput.addEventListener('change', updateWorkedSinceVisibility);
    updateWorkedSinceVisibility();
}

function bindActions() {
    const downloadTxtBtn = document.getElementById('downloadTxtBtn');
    if (downloadTxtBtn) {
        downloadTxtBtn.addEventListener('click', () => {
            const text = buildLetterText();
            downloadFile('cover-letter.txt', text, 'text/plain;charset=utf-8');
        });
    }

    const downloadDocBtn = document.getElementById('downloadDocBtn');
    if (downloadDocBtn) {
        downloadDocBtn.addEventListener('click', () => {
            const docContent = buildDocMarkup();
            downloadFile('cover-letter.doc', docContent, 'application/msword;charset=utf-8');
        });
    }

    const printPdfBtn = document.getElementById('printPdfBtn');
    if (printPdfBtn) {
        printPdfBtn.addEventListener('click', () => {
            downloadPdf();
        });
    }

    const downloadCvTxtBtn = document.getElementById('downloadCvTxtBtn');
    if (downloadCvTxtBtn) {
        downloadCvTxtBtn.addEventListener('click', () => {
            const cvContent = getValue('cvContent');
            downloadFile('cv-content.txt', cvContent, 'text/plain;charset=utf-8');
        });
    }

    const downloadCvDocBtn = document.getElementById('downloadCvDocBtn');
    if (downloadCvDocBtn) {
        downloadCvDocBtn.addEventListener('click', () => {
            const cvContent = escapeHtml(getValue('cvContent')).split('\n').join('<br>');
            const docContent = [
                '<html>',
                '<head><meta charset="UTF-8"></head>',
                '<body style="font-family: Calibri, Arial, sans-serif; font-size: 12pt; line-height: 1.45;">',
                `<p>${cvContent}</p>`,
                '</body>',
                '</html>'
            ].join('');

            downloadFile('cv-content.doc', docContent, 'application/msword;charset=utf-8');
        });
    }
}

function downloadPdf() {
    if (typeof window.html2pdf === 'undefined') {
        window.print();
        return;
    }

    const previewElement = document.getElementById('letterPreview');
    if (!previewElement) {
        return;
    }

    const options = {
        margin: [12, 12, 12, 12],
        filename: 'cover-letter.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    window.html2pdf().set(options).from(previewElement).save();
}

function renderPreview() {
    const data = getFormData();
    const letter = composeLetter(data);
    const headerLines = getLetterHeaderLines(data);

    const previewHtml = [
        `<div class="letter-header">${headerLines.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}</div>`,
        `<p>Dear ${escapeHtml(data.hiringManager)}</p>`,
        `<p>${escapeHtml(letter.intro)}</p>`,
        `<p>${escapeHtml(letter.experience)}</p>`,
        `<p>${escapeHtml(letter.closing)}</p>`,
        `<p>${escapeHtml(letter.thanks)}</p>`,
        `<p>Sincerely,<br>${escapeHtml(data.fullName)}</p>`
    ].join('');

    CoverLetter.preview.innerHTML = previewHtml;
}

function buildLetterText() {
    const data = getFormData();
    const letter = composeLetter(data);
    const headerLines = getLetterHeaderLines(data);

    return [
        ...headerLines,
        '',
        `Dear ${data.hiringManager}`,
        '',
        letter.intro,
        '',
        letter.experience,
        '',
        letter.closing,
        '',
        letter.thanks,
        '',
        'Sincerely,',
        data.fullName
    ].join('\n');
}

function buildDocMarkup() {
    const data = getFormData();
    const letter = composeLetter(data);
    const headerLines = getLetterHeaderLines(data);

    return [
        '<html>',
        '<head><meta charset="UTF-8"></head>',
        '<body style="font-family: Calibri, Arial, sans-serif; font-size: 12pt; line-height: 1.45;">',
        `<div style="text-align: right; margin-bottom: 10px;">${headerLines.map((line) => `<p style="margin: 0 0 2px;">${escapeHtml(line)}</p>`).join('')}</div>`,
        `<p>Dear ${escapeHtml(data.hiringManager)}</p>`,
        `<p>${escapeHtml(letter.intro)}</p>`,
        `<p>${escapeHtml(letter.experience)}</p>`,
        `<p>${escapeHtml(letter.closing)}</p>`,
        `<p>${escapeHtml(letter.thanks)}</p>`,
        `<p>Sincerely,<br>${escapeHtml(data.fullName)}</p>`,
        '</body>',
        '</html>'
    ].join('');
}

function getFormData() {
    const rawDate = getValue('letterDate');

    return {
        displayDate: formatDate(rawDate),
        hiringManager: getValue('hiringManager'),
        positionTitle: getValue('positionTitle'),
        companyName: getValue('companyName'),
        yearsExperience: getValue('yearsExperience'),
        coreSkills: getValue('coreSkills'),
        currentCompany: getValue('currentCompany'),
        workedSince: getValue('workedSince'),
        phoneNumber: '0845388953',
        emailAddress: 'sithembiso72@gmail.com',
        fullName: 'Sithembiso Sangweni',
        valueStatement: getValue('valueStatement'),
        closingMotivation: getValue('closingMotivation')
    };
}

function getLetterHeaderLines(data) {
    return [
        data.fullName,
        'Johannesburg',
        data.phoneNumber,
        data.emailAddress,
        data.displayDate
    ];
}

function composeLetter(data) {
    const includeWorkedSince = !isTBWACompany(data.currentCompany) && data.workedSince;
    const experienceLead = includeWorkedSince
        ? `In my current role at ${data.currentCompany}, where I have worked since ${data.workedSince},`
        : `I am currently working at TBWA SA since 2020,`;

    return {
        intro: `I am writing to express my interest in the ${data.positionTitle} role at ${data.companyName}. With ${data.yearsExperience} years of hands-on experience developing and testing software applications, I am confident that I can add value to your team from day one.`,
        experience: `${experienceLead} I have strengthened my full-stack development skills and built practical experience in ${data.coreSkills}. I enjoy building reliable solutions to real user problems and collaborating with teams to deliver quality outcomes. ${data.valueStatement}`,
        closing: `${data.closingMotivation} I would welcome the opportunity to discuss how my experience and mindset align with your goals. Please check my portfolio here www.putitdigital.co.za/portfolio`,
        thanks: 'Thank you for your time and consideration. I look forward to the opportunity to speak with you.'
    };
}

function isTBWACompany(companyName) {
    return companyName.trim().toUpperCase() === 'TBWA';
}

function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function formatDate(rawDate) {
    if (!rawDate) return '';
    const date = new Date(rawDate + 'T00:00:00');
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
        return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener';
    link.style.display = 'none';

    if (typeof link.download === 'string') {
        document.body.appendChild(link);
        link.click();
        link.remove();
    } else {
        window.open(url, '_blank');
    }

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
