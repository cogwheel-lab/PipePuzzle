// ==UserScript==
// @name         5ch IDに名前を表示（スレタイ版）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  IDの下に任意の名前を表示します（動的表示ページ対応）
// @match        https://itest.5ch.net/*/read.cgi/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const today = new Date().toISOString().split("T")[0];
    const storageKey = "idNames_" + today;
    let idMap = {};

    try {
        idMap = JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch (e) {
        console.error("ID Name: 保存データの読み取り中にエラー", e);
        idMap = {};
    }

    function saveMap() {
        localStorage.setItem(storageKey, JSON.stringify(idMap));
    }

    function promptName(id) {
        const current = idMap[id] || "";
        const name = prompt(`ID「${id}」に付ける名前を入力してください（空白で削除）:`, current);
        if (name !== null) {
            if (name.trim() === "") {
                delete idMap[id];
            } else {
                idMap[id] = name.trim();
            }
            saveMap();
            render();
        }
    }

    // ページの動的な変更を監視するMutationObserverを準備
    const observer = new MutationObserver(render);

    function render() {
        // ★★★ 修正点(1) ★★★
        // 無限ループを防ぐため、処理の開始前に監視を一時停止する
        observer.disconnect();

        document.querySelectorAll(".res_id").forEach(el => {
            const match = el.textContent.match(/ID:([a-zA-Z0-9+/=]+)/);
            if (!match) return;
            const id = match[1];
            const name = idMap[id];
            const existing = el.parentElement.querySelector(".id-nickname");

            if (existing) existing.remove();

            if (name) {
                const nameTag = document.createElement("div");
                nameTag.className = "id-nickname";
                nameTag.textContent = `👤 ${name}`;
                nameTag.style.fontSize = "1em";
                nameTag.style.color = "#f00";
                nameTag.style.marginTop = "2px";
                el.parentElement.appendChild(nameTag);
            }

            if (!el.dataset.clickListenerAdded) {
                el.addEventListener("click", e => {
                    if (e.altKey) {
                        e.preventDefault();
                        e.stopPropagation();
                        promptName(id);
                    }
                });
                el.dataset.clickListenerAdded = "true";
            }
        });

        // ★★★ 修正点(2) ★★★
        // 処理が終わった後、ページの新しい変更を検知するために監視を再開する
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 監視を開始し、初回のrenderを実行
    render();
})();
