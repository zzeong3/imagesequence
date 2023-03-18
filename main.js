const frame = document.querySelector('section');
const mask = document.querySelector('aside');
const delayTime = convertSpeed(mask);
let imgs = '';
const count = 200;
// 소이 이미지가 로딩 완료될때마다 카운트될 변수 추가
let num = 0;

// 동적 IMG DOM 생성
for (let i = 1; i <= count; i++) {
	imgs += `
        <img src ='img/pic${i}.jpg' />
    `;
}

frame.innerHTML = imgs;

// 위에 동적으로 만든 200개의 이미지요소를 변수에 저장
const imgDOM = frame.querySelectorAll('img');
console.log(imgDOM);

// img dom에 적용된 소스이미지가 로딩완료 될때마다 반복
imgDOM.forEach((img) => {
	// onload - 해당 DOM에 수반되는 소스이미지까지 로딩 완료 되었을대 실행되는 이벤트
	// onerror - 해당 이미지에 수반되는 소스이미지에 문제가 발생 했을때 실행되는 이벤트
	img.onload = () => {
		num++;

		const persent = parseInt((num / 200) * 100);
		//변경되는 퍼센트 값을 마스크 안쪽 span에 출력
		mask.querySelector('span').innerText = persent;
		mask.querySelector('.bar').style.width = persent + '%';

		if (persent === 100) {
			console.log('이미지 로딩 완료시 마스크 제거');
			mask.classList.add('off');
			// mask요소애 off 클래스가 붙은 순간에 css 구문에 의해 2초동안 fadeOut이 실행됨 (브라우저)
			// 스크립트로 하여금 강제로 2초뒤에 마스크 제거구문을 호출
			setTimeout(() => {
				mask.remove();
			}, delayTime);
		}
	};
});

// 생성된 DOM를 제어하는 이벤트 연결
// frame에 mousemove 이벤트 연결
frame.addEventListener('mousemove', (e) => {
	// e.clientX (현재 화면에서 마우스포인터의 가로 위치값)
	// 이슈사항 - 현재 이미지가 100개이기 때문에 마우스 무브시 무조건 좌표값이 1-100사이가 찍히도록 백분율로 변환
	// 백분율 공식 (현재수치값 / 전체수치값) * 100
	//console.log('clientX', e.clientX);

	// 전체 브라우저 폭 대비 현재 마우스포인터 가로 위치값을 백분율화 (소수점  포함)
	let percent = (e.clientX / window.innerWidth) * count;
	percent = parseInt(percent); // 소수점 아래값을 제거해서 정수형태로 덮어씀
	//console.log(percent);

	// 마우스 움직일때마다 순간적으로 200개의 이미지 모두를 안보이게 처리해서 초기화
	imgDOM.forEach((img) => (img.style.display = 'none'));

	//200개의 이미지중에서 현재 마우스포인터 순번에 해당하는 이미지만 보임처리
	imgDOM[percent].style.display = 'block';
});

function convertSpeed(el) {
	//console.log(mask.style.transitionDuration);
	let speed = getComputedStyle(el)['transition-duration']; // 2.5s
	speed = parseFloat(speed) * 1000;
	console.log(speed);

	return speed;
}

/*
	1. css에서 aside 요소에 연결되어잇는 transitionDuration 값을 가져옴 ('2.5s')
	css 의해서 적용된 스타일 값을 자바스크립트 돔 객체로 부터 직접 스타일 값을 가져올수 없음
	브라우저에 의해서 렌더링된 값을 재연산해서 그 결과값을 가져와야함 (getComputedStyle 활용)
	2. '2.5s' 문자값을 숫자로 변환한 뒤 1000을 곱함
	- parseInt(문자값) : 정수로 변환
	- parseFloat(문자 or 숫자) : 실수로 변환
	3. 숫자로 반환된 값을 return
*/
