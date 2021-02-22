export interface IRecordsOrderChanger {
    setNewY: (y: number) => void,
    start: (target: number, elements: any[]) => void,
    finish: () => number,
}

export function getRecordsOrderChanger() : IRecordsOrderChanger {
    let StartY : number,
        Target : number,
        Elements : any[],
        Tops : number[] = [],
        Bottoms : number[] = [],
        Height : number,
        canStartBeCalled : boolean = true,
        oldIndex : number,
        styles : Set<string> = new Set();

    const getTop : (index:number) => number = (index) =>
        Elements[index].getBoundingClientRect().top;
    const getBottom : (index: number) => number = (index) =>
        Elements[index].getBoundingClientRect().bottom;
    const calcMiddleY : (index: number) => number = (index) =>
        (getTop(index) + getBottom(index)) / 2;
    const setStyle : (styleName : string, value : any) => void = (styleName, value) => {
        Elements[Target].style[styleName] = value;
        styles.add(styleName);
    }
    const deactivateStyles : () => void = () => {
        styles.forEach((styleName) => {
            Elements[Target].style[styleName] = '';
        })
    }
    const setY = (y) => {
        setStyle('top', (y - StartY) + 'px');
    }

    const turnSlideOn = (index) => {
        Elements[index].classList.add(index > Target ? 'up' : 'down');
    }
    const turnSlideOff = (index) => {
        Elements[index].classList.remove(index > Target ? 'up' : 'down');
    }

    function getReplacer() {
        oldIndex = Target;
        const turnBetween = (from, to, turnFunc) => {
            for (let i = from; i <= to; i++) {
                turnFunc(i);
            }
        }
        return (index) => {
            if (oldIndex !== index) {
                if (oldIndex === Target) {
                    turnBetween(index, Target - 1, turnSlideOn);
                    turnBetween(Target + 1, index, turnSlideOn);
                } else
                if (index === Target) {
                    turnBetween(oldIndex, Target - 1, turnSlideOff);
                    turnBetween(Target + 1, oldIndex, turnSlideOff);
                } else
                if (index < Target) {
                    if (oldIndex < index) {
                        turnBetween(oldIndex, index - 1, turnSlideOff);
                    } else
                    if (oldIndex < Target) {
                        turnBetween(index, oldIndex - 1, turnSlideOn);
                    } else {
                        turnBetween(index, Target - 1, turnSlideOn);
                        turnBetween(Target + 1, oldIndex, turnSlideOff);
                    }
                } else { // index > Target
                    if (oldIndex > index) {
                        turnBetween(index + 1, oldIndex, turnSlideOff);
                    } else
                    if (oldIndex > Target) {
                        turnBetween(oldIndex + 1, index, turnSlideOn);
                    } else {
                        turnBetween(Target + 1, index, turnSlideOn);
                        turnBetween(oldIndex, Target - 1, turnSlideOff);
                    }
                }
            }
            oldIndex = index;
        }
    }

    const replacer = getReplacer();

    return {
        start:(target, elements)=>{
            if (!canStartBeCalled) {
                throw new Error('Trying to call \'start\' method again');
            }
            canStartBeCalled = false;
            Target = target;
            Elements = elements;
            Tops = Elements.map((element, index) => getTop(index));
            Bottoms = Elements.map((elements, index) => getBottom(index));
            StartY = calcMiddleY(Target);
            Height = Math.abs(getTop(Target) - getBottom(Target));
            setStyle('position', 'relative');
            setStyle('zIndex', 3);
            Elements.filter((element, index) => index !== Target)
                .forEach((element) => {element.classList.add('slided')});
        },
        setNewY: (y) => {
            let newY = y;
            if (newY > StartY) {
                let l, r, m;
                l = 0;
                r = Tops.length;
                while (l + 1 < r) {
                    m = (l + r) >> 1;
                    if (Tops[m] >= newY) {
                        r = m;
                    } else {
                        l = m;
                    }
                }
                console.log('in setNewY', y, l);
                replacer(l);
                setY(y);
            } else {
                let l, r, m;
                l = -1;
                r = Bottoms.length - 1;
                while (l + 1 < r) {
                    m = (l + r) >> 1;
                    if (Bottoms[m] >= newY) {
                        r = m;
                    } else {
                        l = m;
                    }
                }
                console.log('in setNewY', y, r);
                replacer(r);
                setY(y);
            }
        },
        finish: () => {
            for (let i = 0; i < Elements.length; i++)
                turnSlideOff(i);
            Elements.filter((element, index) => index !== Target)
                .forEach((element) => {element.classList.remove('slided')});
            deactivateStyles();
            return oldIndex;
        },
    }
}
