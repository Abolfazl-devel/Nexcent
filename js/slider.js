'use strict';

// slider
const sliderParent = document.getElementById('slider-parent');
const slider = document.getElementById('slider__items');
let dragStart = false;
const sliderStart = 0;
let sliderX = 0;
const sliderSpeed = 0.8;
const sliderChangeXValue = 20;
let XTranslate = -1336;
let checkMouseMove = false;
let MoveTranslateX = -1336;
let endPo = -5344;
let sliderPositions = [-1336, -2672, -4008];
let closestPosition = 0;
let checkSlidersPos = [true, false, false];
let rightTranslateX = -1336;
let itemSize = -1336;
let noneTransion = false;
const littleBut = document.querySelectorAll('.slide__indicating div');

function changeTreanslateX(witchPos, checkSlider) {
    rightTranslateX = witchPos;
    closestPosition = '';
    checkSlidersPos = checkSlider;
};

function deActive() {
    littleBut.forEach(function (button) {
        button.classList.remove('active');
    });
};

function endSlide(xTrans, xTrans2, checkSlider) {
    deActive();
    rightTranslateX = xTrans;
    slider.style.transform = `translate3d(${rightTranslateX}px, 0, 0)`;
    slider.style.transition = 'transform 0.3s ease-out';
    rightTranslateX = xTrans2;
    noneTransion = true;
    slider.addEventListener('transitionend', function () {
        slider.style.transition = 'none';
        slider.style.transform = `translate3d(${rightTranslateX}px, 0, 0)`;

    }, { once: true }); closestPosition = '';
    checkSlidersPos = checkSlider;
};
function endSlider(pos) {
    slider.style.transition = 'none';
    slider.style.transform = `translateX(${pos}px)`;
};

slider.addEventListener('mousedown', function (e) {
    sliderDown(e);
});


function sliderRightPos() {
    const position = [sliderPositions[0], sliderPositions[1], sliderPositions[2]];

    noneTransion = false;

    if (closestPosition == '') {
        closestPosition = position.indexOf(XTranslate);
    };



    if (checkMouseMove) {
        switch (closestPosition) {

            case 0:
                if (XTranslate > MoveTranslateX) {
                    changeTreanslateX(sliderPositions[1], [false, true, false]);
                    deActive();
                    littleBut[1].classList.add('active');
                } else {
                    endSlide(sliderStart, sliderPositions[2], [false, false, true]);
                    deActive();
                    littleBut[2].classList.add('active');
                };
                break;
            case 1:
                if (XTranslate > MoveTranslateX) {
                    changeTreanslateX(sliderPositions[2], [false, false, true]);
                    deActive();
                    littleBut[2].classList.add('active');
                } else {
                    changeTreanslateX(sliderPositions[0], [true, false, false]);
                    deActive();
                    littleBut[0].classList.add('active');
                };
                break;
            case 2:
                if (XTranslate > MoveTranslateX) {
                    endSlide(endPo, sliderPositions[0], [true, false, false]);
                    deActive();
                    littleBut[0].classList.add('active');
                } else {
                    changeTreanslateX(sliderPositions[1], [false, true, false]);
                    deActive();
                    littleBut[1].classList.add('active');
                };
                break;
        };
        checkMouseMove = false;

        slider.addEventListener('transitionend', function () {
            const transformValue = window.getComputedStyle(slider).transform;
            if (transformValue !== 'none') {
                const regex3d = /matrix3d\(([^)]+)\)/;
                const match3d = transformValue.match(regex3d);

                if (match3d) {
                    const matrix3d = match3d[1].split(',').map(parseFloat);
                    XTranslate = matrix3d[12];
                } else {
                    const regex2d = /matrix\(([^)]+)\)/;
                    const match2d = transformValue.match(regex2d);

                    if (match2d) {
                        const matrix2d = match2d[1].split(',').map(parseFloat);
                        XTranslate = matrix2d[4];
                    };
                };
            };
        }, { once: true });
        if (!noneTransion) {
            slider.style.transform = `translate3d(${rightTranslateX}px, 0, 0)`;
            slider.style.transition = 'transform 0.3s ease-out';
        };

    };
};

function sliderMove(event) {
    if (dragStart) {
        MoveTranslateX = event.pageX;
        let deltaX = MoveTranslateX - sliderX;
        deltaX = Math.max(Math.min(deltaX, sliderChangeXValue), -sliderChangeXValue);
        rightTranslateX += deltaX * sliderSpeed;
        if (rightTranslateX > sliderStart) {
            rightTranslateX = endPo;
        } else if (rightTranslateX < endPo) {
            rightTranslateX = sliderStart;
        };
        slider.style.transition = 'none';
        slider.style.transform = `translateX(${rightTranslateX}px)`;
        sliderX = event.pageX;
        MoveTranslateX = 0;

        const transformValue = window.getComputedStyle(slider).transform;
        if (transformValue !== 'none') {
            const regex3d = /matrix3d\(([^)]+)\)/;
            const match3d = transformValue.match(regex3d);

            if (match3d) {
                const matrix3d = match3d[1].split(',').map(parseFloat);
                MoveTranslateX = matrix3d[12];
            } else {
                const regex2d = /matrix\(([^)]+)\)/;
                const match2d = transformValue.match(regex2d);

                if (match2d) {
                    const matrix2d = match2d[1].split(',').map(parseFloat);
                    MoveTranslateX = matrix2d[4];
                };
            };
        };
        checkMouseMove = true;
    };
};

function sliderUp(e) {
    sliderRightPos();
    dragStart = false;
    sliderX = e.pageX;
};

function sliderLeave(e) {
    if (dragStart) {
        sliderRightPos();
        dragStart = false;
    };
    sliderX = e.pageX;
    dragStart = false;
};

function sliderDown(e) {
    dragStart = true;
    sliderX = e.pageX;
    slider.style.transition = 'none';
}

slider.addEventListener('mousemove', function (event) {
    sliderMove(event);
});

slider.addEventListener('mouseup', function (e) {
    sliderUp(e);
});
slider.addEventListener('mouseleave', function (e) {
    sliderLeave(e);
});


slider.addEventListener('touchstart', function (e) {
    sliderDown(e.changedTouches[0]);
});

slider.addEventListener('touchmove', function (e) {
    sliderMove(e.changedTouches[0]);
});

slider.addEventListener('touchend', function (e) {
    sliderUp(e.changedTouches[0]);
});

slider.addEventListener('touchcancel', function (e) {
    sliderLeave(e.changedTouches[0]);
});

let checkEndPos = false;
littleBut.forEach(function (button, index) {
    button.onclick = function () {
        switch (index) {
            case 0:
                if (littleBut[2].classList.contains('active')) {
                    changePos(endPo, '', [true, false, false]);
                    checkEndPos = true;
                } else {
                    changePos(sliderPositions[0], '', [true, false, false]);
                };
                littleBut[0].classList.add('active');
                break;
            case 1:
                endSlider(sliderPositions[0]);
                setTimeout(() => {
                    changePos(sliderPositions[1], '', [false, true, false]);
                    littleBut[1].classList.add('active');
                }, 10);
                break;
            case 2:
                sliderPositions[endPo];
                setTimeout(() => {
                    changePos(sliderPositions[2], '', [false, false, true]);
                    littleBut[2].classList.add('active');
                }, 10);
                break;
        };
        setTimeout(() => {
        }, 10);
    };
});

function changePos(pos, nowPos, arrayValue) {
    slider.style.transform = `translateX(${pos}px)`;
    slider.style.transition = 'transform 0.5s ease-out';
    deActive();
    XTranslate = pos;
    rightTranslateX = pos;
    MoveTranslateX = pos;
    closestPosition = nowPos;
    checkSlidersPos = arrayValue;
};



function sliderResponsive() {
    function backToPos(size) {
        itemSize = size;
        endPo = itemSize * 4;
        sliderPositions = [itemSize, itemSize * 2, itemSize * 3];
        if (checkSlidersPos[0]) {
            changePos(sliderPositions[0], 0, [true, false, false]);
            littleBut[0].classList.add('active');
        } else if (checkSlidersPos[1]) {
            changePos(sliderPositions[1], 1, [false, true, false]);
            littleBut[1].classList.add('active');
        } else if (checkSlidersPos[2]) {
            changePos(sliderPositions[2], 2, [false, false, true]);
            littleBut[2].classList.add('active');
        };
    };
    if (window.innerWidth < -1336) {
        backToPos(window.innerWidth);
    } else {
        backToPos(-1336);
    };
};
sliderResponsive();
window.addEventListener('resize', function () {
    sliderResponsive();
});
// slider
