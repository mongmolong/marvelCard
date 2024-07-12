let marvelInput = document.getElementById("marvel_input");
let marvelBtn = document.getElementById("marvel_submit_button");
let marvelShowContainer = document.getElementById("marvel_show_container");
let marvelListContainer = document.querySelector(".marvel_list");

let initialSearch = "iron man";

let date = new Date();
console.log(date.getTime());

const [timestamp, apiKey, hashValue] = [ts, publicKey, hashVal];

window.onload = async () => {
    marvelInput.value = initialSearch; // 초기 검색어 설정
    await getResult(initialSearch); // 초기 검색어로 캐릭터 정보 가져오기
};

// 입력 필드에서 키 입력 시 자동 완성 기능 구현
marvelInput.addEventListener("input", async () => {
    let inputValue = marvelInput.value.trim();
    marvelListContainer.innerHTML = ""; // 자동 완성 결과를 비우기

    if (inputValue.length < 1) {
        return; // 입력 값이 없으면 종료
    }

    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}&nameStartsWith=${inputValue}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('네트워크 응답이 실패했습니다.');
        }

        const jsonData = await response.json();
        const results = jsonData.data.results.slice(0, 5); // 최대 5개의 결과만 가져오기

        if (results.length === 0) {
            marvelListContainer.innerHTML = "<p>검색 결과가 없습니다.</p>";
            return;
        }

        results.forEach((result) => {
            let name = result.name;
            let div = document.createElement("div");
            div.style.cursor = "pointer";
            div.classList.add("autocomplete_items");
            div.setAttribute("onclick", `displayCharacter('${name}')`);
            let highlightedText = `<b>${inputValue}</b>${name.substr(inputValue.length)}`;
            div.innerHTML = `<p class="marvel_item">${highlightedText}</p>`;
            marvelListContainer.appendChild(div);
        });
    } catch (error) {
        console.error('Fetch 에러:', error);
        marvelListContainer.innerHTML = "<p>검색 중 오류가 발생했습니다.</p>";
    }
});

// 자동 완성된 항목을 클릭했을 때 실행되는 함수
function displayCharacter(value) {
    marvelInput.value = value;
    removeAutocomplete();
    getResult(value); // 선택한 캐릭터의 정보를 가져옴
}

// 자동 완성 결과를 지우는 함수
function removeAutocomplete() {
    marvelListContainer.innerHTML = "";
}

// 검색 버튼 클릭 시 실행되는 함수
marvelBtn.addEventListener("click", () => {
    let inputValue = marvelInput.value.trim();
    if (inputValue.length < 1) {
        alert(`검색어를 입력해주세요.`);
        return;
    }
    removeAutocomplete();
    getResult(inputValue); // 입력된 검색어로 캐릭터 정보를 가져옴
});

// Enter 키 입력 시 검색 기능 실행
marvelInput.addEventListener("keyup", (event) => {
    if (event.key === 'Enter') {
        let inputValue = marvelInput.value.trim();
        if (inputValue.length < 1) {
            alert(`검색어를 입력해주세요.`);
            return;
        }
        removeAutocomplete();
        getResult(inputValue); // Enter 키 입력으로 검색어로 캐릭터 정보를 가져옴
    }
});
// Marvel API를 통해 캐릭터 정보를 가져와서 화면에 표시하는 함수
async function getResult(inputValue) {
    marvelShowContainer.innerHTML = "";

    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}&name=${inputValue}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('네트워크 응답이 실패했습니다.');
        }
        const jsonData = await response.json();
        if (jsonData.data.results.length === 0) {
            marvelShowContainer.innerHTML = "<p>검색 결과가 없습니다.</p>";
            return;
        }
        jsonData.data.results.forEach((element) => {
            marvelShowContainer.innerHTML += 
            `<div class="marvel_card_container">
                <div class="marvel_container_character_image">
                    <img src="${element.thumbnail.path}.${element.thumbnail.extension}" />
                </div>
                <div class="marvel_character_name">${element.name}</div>
                <div class="marvel_character_description">${element.description}</div>
            </div>`;
        });
    } catch (error) {
        console.error('Fetch 에러:', error);
        marvelShowContainer.innerHTML = "<p>검색 중 오류가 발생했습니다.</p>";
    }
}
