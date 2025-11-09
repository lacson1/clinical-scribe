const newSessionButton = document.getElementById('new-session');
const clearTranscriptButton = document.getElementById('clear-transcript');
const transcriptContainer = document.getElementById('transcript');
const statusIndicator = document.getElementById('status');
const timelineList = document.getElementById('timeline');
const eventCountBadge = document.getElementById('event-count');
const noteForm = document.getElementById('note-form');
const noteTextarea = document.getElementById('note-text');
const timelineTemplate = document.getElementById('timeline-item-template');

const summaryTabs = Array.from(document.querySelectorAll('.tab'));
const summaries = Array.from(document.querySelectorAll('.summary'));

let eventCount = 0;
let sessionActive = false;

const samplePrompts = [
  {
    heading: 'Patient presents with chest discomfort',
    detail: 'Reported intermittent chest tightness over the past 4 days, worse with exertion.'
  },
  {
    heading: 'Vitals updated',
    detail: 'BP 128/82, HR 74, RR 16, SpO2 97%. No acute distress noted.'
  },
  {
    heading: 'Assessment updated',
    detail: 'Working diagnosis includes atypical chest pain; consider GERD vs. anxiety-related etiology.'
  },
  {
    heading: 'Plan drafted',
    detail: 'Order ECG and troponin. Provide patient education on warning signs and follow-up in 48h.'
  }
];

function setStatus(isActive) {
  statusIndicator.textContent = isActive ? 'Live capture' : 'Disconnected';
  statusIndicator.classList.toggle('live', isActive);
}

function updateEventCount() {
  eventCountBadge.textContent = `${eventCount} ${eventCount === 1 ? 'event' : 'events'}`;
}

function formatTime(date) {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
}

function renderTranscript(text) {
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  transcriptContainer.append(paragraph);
  transcriptContainer.scrollTop = transcriptContainer.scrollHeight;
}

function addTimelineEvent({ heading, detail }) {
  const fragment = timelineTemplate.content.cloneNode(true);
  const item = fragment.querySelector('.timeline-item');
  const timestamp = item.querySelector('.timestamp');
  const title = item.querySelector('h3');
  const body = item.querySelector('p');

  timestamp.textContent = formatTime(new Date());
  title.textContent = heading;
  body.textContent = detail;

  timelineList.prepend(item);
  eventCount += 1;
  updateEventCount();
}

function startSession() {
  sessionActive = true;
  setStatus(true);
  transcriptContainer.innerHTML = '';
  renderTranscript('Session started. Listening for speaker turns...');
  eventCount = 0;
  timelineList.innerHTML = '';
  updateEventCount();

  samplePrompts.forEach((prompt, index) => {
    window.setTimeout(() => {
      if (!sessionActive) return;
      renderTranscript(prompt.detail);
      addTimelineEvent(prompt);
    }, (index + 1) * 1500);
  });
}

function endSession() {
  sessionActive = false;
  setStatus(false);
  renderTranscript('Session ended. You can start a new capture at any time.');
}

summaryTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const targetId = tab.dataset.target;

    summaryTabs.forEach((other) => other.classList.toggle('active', other === tab));
    summaries.forEach((summary) => {
      summary.classList.toggle('active', summary.id === targetId);
    });
  });
});

noteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const note = noteTextarea.value.trim();
  if (!note) return;

  addTimelineEvent({
    heading: 'Clinician note',
    detail: note
  });

  renderTranscript(`Clinician note added: ${note}`);
  noteTextarea.value = '';
  noteTextarea.focus();
});

newSessionButton.addEventListener('click', () => {
  if (sessionActive) {
    endSession();
    newSessionButton.textContent = 'New session';
    return;
  }

  startSession();
  newSessionButton.textContent = 'End session';
});

clearTranscriptButton.addEventListener('click', () => {
  transcriptContainer.innerHTML = '';
  renderTranscript('Transcript cleared. Waiting for the next utterance...');
});

updateEventCount();
setStatus(false);
renderTranscript('Ready when you are. Click "New session" to begin capturing a visit.');

