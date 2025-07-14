document.querySelectorAll('.tile.corner').forEach(tile => {
  tile.dataset.rotation = tile.dataset.rotation || '0';

  tile.addEventListener('click', () => {
    let rotation = (parseInt(tile.dataset.rotation) + 90) % 360;
    tile.dataset.rotation = rotation;
    tile.style.transform = `rotate(${rotation}deg)`;
    setTimeout(() => {
      checkRouteConnection();
    }, 300);
  });
});

function normalizeRotation(deg) {
  return ((deg % 360) + 360) % 360;
}

function checkRouteConnection() {
  console.log("チェック関数が呼ばれました");

  const expected = {
    "0,2": 180,
    "0,4": 270,
    "3,2": 90
  };

  let isCorrect = true;

  Object.entries(expected).forEach(([key, correct]) => {
    const tile = document.querySelector(`.tile[data-x="${key.split(',')[1]}"][data-y="${key.split(',')[0]}"]`);
    const actual = normalizeRotation(parseInt(tile.dataset.rotation));
    if (actual !== correct) {
      console.log(`tile[${key}] = ${actual}, 正解 = ${correct}`);
      isCorrect = false;
    }
  });

  const status = document.getElementById('status');
  if (isCorrect) {
    status.textContent = '✨ すばらしいです、お嬢様！ 完璧なルートが完成しました！ ✨';
    status.classList.add('success');
  } else {
    status.textContent = 'コーナーピース（青い└）をクリックして回転させ、スタートからゴールまでの道を作ろう！';
    status.classList.remove('success');
  }
}
