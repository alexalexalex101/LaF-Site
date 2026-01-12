<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$conn = new mysqli("localhost", "root", "", "lost_and_found");
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);


// Handle actions
if (isset($_POST['action'], $_POST['id'])) {
   $id = (int)$_POST['id'];
   $action = $_POST['action'];


   if ($action === 'approve') {
       $stmt = $conn->prepare("UPDATE lost_items SET status='approved' WHERE id=?");
       $stmt->bind_param("i", $id);
       $stmt->execute();
       $stmt->close();
   } elseif ($action === 'reject' || $action === 'remove') {
       $stmt = $conn->prepare("DELETE FROM lost_items WHERE id=?");
       $stmt->bind_param("i", $id);
       $stmt->execute();
       $stmt->close();
   } elseif ($action === 'save') {
       $desc = $_POST['description'] ?? '';
       $stmt = $conn->prepare("UPDATE lost_items SET description=? WHERE id=?");
       $stmt->bind_param("si", $desc, $id);
       $stmt->execute();
       $stmt->close();
   }
}


// Fetch items
$incoming = $conn->query("SELECT * FROM lost_items WHERE status='pending' ORDER BY id DESC");
$existing = $conn->query("SELECT * FROM lost_items WHERE status='approved' ORDER BY id DESC");
?>


<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Panel - Lost and Found</title>
<link rel="stylesheet" href="styles.css">
<style>
/* Layout */
.admin-container { display: flex; gap: 1rem; margin-top: 2rem; height: 75vh; }
.admin-list { flex: 0 0 200px; max-height: 100%; overflow-y: auto; background: #165cb9; padding: 1rem; border-radius: 1rem; color:white; }
.admin-list-item { padding: 0.6rem 0.8rem; margin-bottom: 0.4rem; border-radius: 0.6rem; cursor: pointer; background: #0e3e82; transition: 0.2s; text-align: center; }
.admin-list-item:hover, .admin-list-item.active { background: #004aad; }
.admin-list-empty { text-align:center; padding:1rem; font-style:italic; color:#ccc; }
.admin-detail { flex: 1; background: #d0eaff; border-radius: 1rem; padding: 1rem; display: flex; flex-direction: column; gap: 1rem; }
.admin-detail img { max-width: 250px; max-height: 250px; border-radius: 0.8rem; border: 2px solid #0e3e82; align-self:center; }
.admin-detail textarea { width: 100%; min-height: 100px; padding:0.5rem; font-size:1rem; border-radius:0.6rem; border:1px solid #0e3e82; resize:vertical; }
.admin-detail .actions { display: flex; gap:0.5rem; justify-content: center; margin-top:0.5rem; }
button { padding:0.5rem 1rem; font-weight:600; border:none; border-radius:0.6rem; cursor:pointer; }
button.approve { background-color: #1b5e20; color:white; }
button.reject { background-color: #c62828; color:white; }
button.save { background-color: #004aad; color:white; }
button.remove { background-color: #c62828; color:white; }
.top-bar { display:flex; justify-content: space-between; align-items:center; margin-top:1rem; }
.top-bar select { padding:0.5rem 1rem; font-size:1rem; border-radius:0.5rem; }
</style>
</head>
<body>
<div class="container">
<header>
   <div class="logo-container">
       <a href="index.html"><img src="images/pctvslogo.png" alt="PCTVS Logo" class="logo"></a>
   </div>
</header>


<main>
<div class="top-bar">
   <h1 style="color:white;">Admin Panel</h1>
   <select id="modeSelect">
       <option value="incoming">Incoming Reports</option>
       <option value="existing">Existing Items</option>
   </select>
</div>


<div class="admin-container">
   <div class="admin-list" id="itemList">
       <?php if($incoming->num_rows===0 && $existing->num_rows===0): ?>
           <div class="admin-list-empty">No items to display</div>
       <?php else: ?>
           <?php foreach($incoming as $item): ?>
               <div class="admin-list-item" data-mode="incoming" data-id="<?= $item['id'] ?>" data-photo="<?= $item['photo'] ?>" data-type="<?= htmlspecialchars($item['item_type']) ?>" data-desc="<?= htmlspecialchars($item['description']) ?>">
                   <?= htmlspecialchars($item['item_type']) ?>
               </div>
           <?php endforeach; ?>
           <?php foreach($existing as $item): ?>
               <div class="admin-list-item" data-mode="existing" data-id="<?= $item['id'] ?>" data-photo="<?= $item['photo'] ?>" data-type="<?= htmlspecialchars($item['item_type']) ?>" data-desc="<?= htmlspecialchars($item['description']) ?>" style="display:none;">
                   <?= htmlspecialchars($item['item_type']) ?>
               </div>
           <?php endforeach; ?>
       <?php endif; ?>
   </div>


   <div class="admin-detail" id="itemDetail">
       <img id="detailPhoto" src="images/boxlogo.png" alt="Item Photo">
       <div><strong>Type:</strong> <span id="detailType"></span></div>
       <div>
           <strong>Description:</strong><br>
           <textarea id="detailDesc" readonly></textarea>
       </div>
       <form id="actionForm" method="POST">
           <input type="hidden" name="id" id="formId">
           <input type="hidden" name="action" id="formAction">
           <div class="actions">
               <button type="submit" class="approve" id="btnApprove">Approve</button>
               <button type="submit" class="reject" id="btnReject">Reject</button>
               <button type="submit" class="save" id="btnSave">Save</button>
               <button type="submit" class="remove" id="btnRemove">Remove</button>
           </div>
       </form>
   </div>
</div>
</main>
</div>


<script>
const modeSelect = document.getElementById('modeSelect');
const listItems = document.querySelectorAll('.admin-list-item');
const detailPhoto = document.getElementById('detailPhoto');
const detailType = document.getElementById('detailType');
const detailDesc = document.getElementById('detailDesc');
const formId = document.getElementById('formId');
const formAction = document.getElementById('formAction');
const btnApprove = document.getElementById('btnApprove');
const btnReject = document.getElementById('btnReject');
const btnSave = document.getElementById('btnSave');
const btnRemove = document.getElementById('btnRemove');
const textarea = detailDesc;


modeSelect.addEventListener('change', () => {
   const mode = modeSelect.value;
   listItems.forEach(item => {
       item.style.display = (item.dataset.mode === mode) ? 'block' : 'none';
   });
   clearDetail();
});


listItems.forEach(item => {
   item.addEventListener('click', () => {
       listItems.forEach(i => i.classList.remove('active'));
       item.classList.add('active');
       detailPhoto.src = item.dataset.photo ? "uploads/" + item.dataset.photo : "images/boxlogo.png";
       detailType.textContent = item.dataset.type;
       detailDesc.value = item.dataset.desc;
       formId.value = item.dataset.id;


       if(item.dataset.mode==='incoming'){
           btnApprove.style.display='inline-block';
           btnReject.style.display='inline-block';
           btnSave.style.display='none';
           btnRemove.style.display='none';
           textarea.readOnly = true;
       } else {
           btnApprove.style.display='none';
           btnReject.style.display='none';
           btnSave.style.display='inline-block';
           btnRemove.style.display='inline-block';
           textarea.readOnly = false;
       }
   });
});


btnApprove.addEventListener('click', ()=> formAction.value='approve');
btnReject.addEventListener('click', ()=> formAction.value='reject');
btnSave.addEventListener('click', ()=> formAction.value='save');
btnRemove.addEventListener('click', ()=> formAction.value='remove');


function clearDetail(){
   detailPhoto.src = "images/boxlogo.png";
   detailType.textContent = '';
   detailDesc.value = '';
   formId.value = '';
}
</script>
</body>
</html>


<?php $conn->close(); ?>


