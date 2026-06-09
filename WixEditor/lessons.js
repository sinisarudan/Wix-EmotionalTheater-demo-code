import wixData from 'wix-data';
import wixLocation from 'wix-location';

let lesson = null;

function highlightActiveButton(slug) {
  const map = {
    "lesson_1": "#btnL1",
    "lesson_2": "#btnL2",
    "lesson_3": "#btnL3"
  };

  // extract lesson number from the slug:
  const btnId = `#btnL${slug.split('_')[1]}`;

  const $btn = $w(btnId);
  if (!$btn) return;

  // STYLE
  $btn.style.backgroundColor = "#000";   // active background
  $btn.style.color = "#fff";             // active text
  $btn.style.borderColor = "#000";       // optional
  $btn.disable();                        // optional: prevent re-clicking current

  // RESET OTHERS:
  Object.values(map).forEach(id => {
    if (id === btnId) return;
    const $otherBtn = $w(id);
    if (!$otherBtn) return;
    $otherBtn.style.backgroundColor = ""; // default background
    $otherBtn.style.color = "";           // default text
    $otherBtn.style.borderColor = "";     // optional
    $otherBtn.enable();                   // optional
  });
}


$w.onReady(async () => {
  console.log("[onReady] init wixLocation", wixLocation);
  const slug = wixLocation.path[0]; // /lesson-demo/{slug}
  console.log("[onReady] slug", slug);
  await loadLesson(slug);

  // Toggle edit mode with ?edit=1
  const isEdit = wixLocation.query.edit === '1';
  console.log("[onReady] isEdit", isEdit);
  setEditMode(isEdit);
  highlightActiveButton(slug);
});

async function loadLesson(slug) {
  console.log("[loadLesson] slug", slug);
  const res = await wixData.query('Lessons').eq('slug', slug).find();
  lesson = res.items[0];

  if (!lesson) {
    $w('#title').text = 'Lesson not found';
    $w('#rtPreview').html = '<p><em>No content.</em></p>';
    return;
  }

  $w('#title').text = lesson.title || `Lesson ${lesson.slug}`;
  $w('#rtPreview').html = lesson.articleRtf || '<p><em>Empty…</em></p>';
  $w('#tbHtml').value = lesson.articleRtf || '';
}

function setEditMode(on) {
  console.log("[setEditMode] isEdit", on);
  if (on) {
    $w('#tbHtml').show();
    $w('#btnSave').show();
  } else {
    $w('#tbHtml').hide();
    $w('#btnSave').hide();
  }
}

// Edit button → show editor
$w('#btnEdit').onClick((event) => {
  setEditMode(true);
});

// Save button → write to CMS and refresh preview
$w('#btnSave').onClick(async (event) => {
  if (!lesson) return;
  const updated = {
    _id: lesson._id,
    articleRtf: $w('#tbHtml').value // HTML string for the rich text field
  };
  lesson = await wixData.update('Lessons', updated);
  $w('#rtPreview').html = lesson.articleRtf || '';
  setEditMode(false);
})

// Optional quick navigation between lessons
$w('#btnL1').onClick((event) => { gotoLesson('lesson_1')});
$w('#btnL2').onClick((event) => { gotoLesson('lesson_2')});
$w('#btnL3').onClick((event) => { gotoLesson('lesson_3')});

function gotoLesson(slug) {
  console.log("[gotoLesson] slug", slug);
  const keepEdit = !$w('#tbHtml').collapsed && !$w('#tbHtml').hidden; // crude check if editing
  const redirect = `/lesson-demo/${slug}${keepEdit ? '?edit=1' : ''}`;
  console.log("[gotoLesson] redirect", redirect);
  wixLocation.to(redirect);
}