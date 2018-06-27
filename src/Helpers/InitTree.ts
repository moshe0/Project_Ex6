import StateStore from "../state/StateStore";
import * as $ from "jquery";
import {GetItems, GetType} from "./MainHelpers";
import {TreeSelectedItem} from "../Models/TreeSelectedItem";


export class InitTree {
    data: any;
    static NeedIgnore = false;

    constructor(public element: any, public Alldata: any[]) {
        this.data = Alldata;
        let ul = document.querySelector("ul");
        if (ul)
            ul.onkeyup = this.keyup;
        this.Load();
    }


    public Load() {
        this.clear();
        for(let item of this.data)
            this._Load(item, '', 0);
    }


    private _Load(data: any, parent: any, indentation: number) {
        let image = document.createElement("img");
        image.style.margin = "5px";
        image.style.verticalAlign = "middle";
        image.src = "/TreeImages/Users/singleUser.png";

        let liTmp = document.createElement("li");
        liTmp.style.textIndent = indentation + "px";
        let li = $(liTmp);

        let span = $("<span>");
        span.appendTo(li);
        let type = GetType(data);
        if (type === 'group')
            image.src = "/TreeImages/Users/multipleUsers.png";

        let img = $(image);
        img.appendTo(span);

        li.addClass(type);
        li.append(data.Name);
        li.appendTo(this.element);
        li.on('dblclick', () => {
            this.dblclick();
        });
        li.on('click', this.click);
        li.data('parent', parent);
        li.data('id', data.Id);

        if (indentation > 0) {
            li.addClass('hidden');
            if (!parent.data('items')) {
                parent.data('items', []);
                parent.data('items').push(li);
            }
            else
                parent.data('items').push(li);
        }

        for (let item of GetItems(data))
            this._Load(item, li, indentation + 25);

    }

    clear() {
        this.element[0].innerHTML = '';
    }

    dblclick() {
        let parent = this.element.find('.inFocus');
        if (parent.length === 0)
            return;
        else {
            let children = $(parent).data('items');
            if (!!children) {
                for (let item of children) {
                    item.toggleClass('hidden');
                    InitTree.hiddenChildrenRecursive($(item).data('items'));
                }
            }
        }
    }

    static hiddenChildrenRecursive(items: any) {
        if (!items)
            return;
        for (let item of items) {
            item.addClass('hidden');
            InitTree.hiddenChildrenRecursive($(item).data('items'));
        }
    }

    click() {
        InitTree.clearFocusClass();

        $(this).addClass('inFocus');
        InitTree.inFocusChanged();
    }

    static inFocusChanged() {
        let Receiver = InitTree.getItemFromPath(InitTree.SelectedArrayPath(), StateStore.getInstance().get('Data'), 0);
        StateStore.getInstance().set('Receiver', Receiver);
    }

    static clearFocusClass() {
        let itemFocused = $('.inFocus');
        itemFocused.removeClass('inFocus');
    }

    keyup = (e: any) => {
        e.stopPropagation();

        switch (e.key) {
            case 'ArrowRight':
                this.ArrowRight();
                InitTree.inFocusChanged();
                break;
            case 'ArrowLeft':
                this.ArrowLeft();
                InitTree.inFocusChanged();
                break;
            case 'ArrowUp':
                this.ArrowUp();
                InitTree.inFocusChanged();
                break;
            case 'ArrowDown':
                this.ArrowDown();
                InitTree.inFocusChanged();
                break;
            case 'Enter':
                this.Enter();
                break;
        }

        console.log('keypress');
    };


    ArrowRight() {
        let parent = this.element.find('.inFocus');
        let children = $(parent).data('items');
        if (parent.length > 0 && !!children) {
            for (let item of children) {
                item.removeClass('hidden');
            }
        }
    }

    ArrowLeft() {
        let parent = this.element.find('.inFocus');
        let children = $(parent).data('items');

        if (parent.length === 0)
            return;
        else if (!children || children[0].hasClass('hidden')) {
            if ($(parent).data('parent') !== '') {
                InitTree.clearFocusClass();
                $(parent).data('parent').addClass('inFocus');
            }
        }
        else {
            for (let item of children) {
                item.addClass('hidden');
                InitTree.hiddenChildrenRecursive($(item).data('items'));
            }
        }
    }

    ArrowUp() {
        let current = this.element.find('.inFocus');
        if (current.length === 0)
            return;
        else {
            let arrLi = this.element.find('li:not(.hidden)');

            for (let index = arrLi.length - 1; index >= 0; index--) {
                if ($(arrLi[index]).text() === current.text() &&
                    $(arrLi[index]).data('parent') === current.data('parent') &&
                    (index - 1) >= 0) {
                    InitTree.clearFocusClass();
                    $(arrLi[index - 1]).addClass('inFocus');
                    break;
                }
            }
        }
    }

    ArrowDown() {
        let current = this.element.find('.inFocus');
        if (current.length === 0)
            $(this.element.find('li')[0]).addClass('inFocus');
        else {
            let arrLi = this.element.find('li:not(.hidden)');

            for (let index = 0; index < arrLi.length; index++) {
                if ($(arrLi[index]).text() === current.text() &&
                    $(arrLi[index]).data('parent') === current.data('parent') &&
                    (index + 1) < arrLi.length) {
                    InitTree.clearFocusClass();
                    $(arrLi[index + 1]).addClass('inFocus');
                    break;
                }
            }
        }
    }

    Enter() {
        this.dblclick();
    }


    static SelectedArrayPath(): string[] {
        let itemFocused = $('.inFocus');
        return InitTree.ArrayPath(itemFocused);
    }

    static ArrayPath(Obj): string[] {
        let pathArr: string[] = [];
        while (typeof (Obj) !== 'string') {
            pathArr.splice(0, 0, Obj.text());
            Obj = Obj.data('parent');
        }

        return pathArr;
    }

    static getItemFromPath(pathArr: string[], data: any[], index: number): any | null {
        for (let i = 0; i < data.length; i++) {
            if (pathArr[index] === data[i].Name) {
                if (pathArr.length - 1 === index)
                    return data[i];
                else {
                    return InitTree.getItemFromPath(pathArr, GetItems(data[i]), ++index);
                }
            }
        }
        return null;
    }


    static SelectedType(): string {
        let itemFocused = $('.inFocus');
        return InitTree.GetType(itemFocused);

    }

    static GetType(itemFocused): string {
        if (itemFocused.length === 0)
            return 'Not selected';

        if (itemFocused.hasClass('group')) {

            let children = $(itemFocused).data('items');
            if (!!children) {
                for (let item of children) {
                    if (item.hasClass('group'))
                        return 'Group with groups';
                }
                for (let item of children) {
                    if (item.hasClass('user'))
                        return 'Group with users';
                }
            }
            return 'Empty group';
        }
        else {
            if (itemFocused.data('parent') === '')
                return 'User without parent';
            return 'User in a parent';
        }
    }

    static GetParentId(): number {
        let itemFocused = $('.inFocus');
        if (itemFocused.length === 0)
            return -1;
        let itemParent = itemFocused.data('parent');
        if (!$(itemParent).data('id'))
            return -1;
        return $(itemParent).data('id');
    }

    static SelectedParentType(): string {
        let itemFocused = $('.inFocus');
        if (itemFocused.length === 0)
            return 'Without parent';
        let itemParent = itemFocused.data('parent');
        let children = $(itemParent).data('items');
        let numOfGroups = 0;
        if (!!children) {
            for (let item of children) {
                if (item.hasClass('group')) {
                    if (numOfGroups === 0)
                        numOfGroups++;
                    else
                        return 'Group with groups';
                }
            }
        }
        return 'With one group';
    }

    static GetSelectedChildrenNames(): string[] {
        let names = [];
        let itemFocused = $('.inFocus');
        if(InitTree.SelectedType() === 'Not selected')
            return names;

        else if(InitTree.SelectedType() === 'User without parent' || InitTree.SelectedType() === 'User in a parent'){
            names.push(itemFocused.text());
            names.push(StateStore.getInstance().get('currentUser').Name);
            return names;
        }

        let children = $(itemFocused).data('items');
        if(!!children){
            for(let item of children)
                names.push(item.text());
        }
        return names;
    }

    static GetSelectedId(): number {
        let itemFocused = $('.inFocus');
        return itemFocused.data('id');
    }

    static GetTreeItem(): TreeSelectedItem {
        return new TreeSelectedItem(
            InitTree.GetSelectedId(),
            InitTree.GetParentId(),
            InitTree.SelectedType(),
            InitTree.SelectedParentType(),
            InitTree.SelectedArrayPath()
        );
    }


    static GetAllTree() {
        return $('ul li');
    }

    static InitExsitingTree() {
        let prevData = StateStore.getInstance().get('AllTree');
        let currentData = $('ul li');
        let indexPrev = 0, indexCurrent = 0;
        if (prevData.length >= currentData.length) { // in case of Fletting or Delete
            while (indexPrev < prevData.length && indexCurrent < currentData.length) {
                if (prevData[indexPrev].innerText === currentData[indexCurrent].innerText &&
                    prevData[indexPrev].style.textIndent === currentData[indexCurrent].style.textIndent) {
                        $(currentData[indexCurrent]).attr('class', prevData[indexPrev].classList);
                        indexPrev++;
                        indexCurrent++;
                }
                else
                    indexPrev++;
            }
        }
        else if (prevData.length < currentData.length) { // in case of Add
            while (indexPrev < prevData.length && indexCurrent < currentData.length) {

                if (prevData[indexPrev].innerText === currentData[indexCurrent].innerText &&
                    prevData[indexPrev].style.textIndent === currentData[indexCurrent].style.textIndent) {
                        $(currentData[indexCurrent]).attr('class', prevData[indexPrev].classList);
                        indexPrev++;
                        indexCurrent++;
                }
                else {
                    for(let i=1 ; !($(prevData[indexPrev - i]).hasClass('inFocus')) && (indexPrev - i) >= 0 ; i++) {
                        if (prevData[indexPrev - i].style.textIndent === currentData[indexCurrent].style.textIndent)
                            $(currentData[indexCurrent]).attr('class', prevData[indexPrev - i].classList);
                    }
                    indexCurrent++;
                }
            }
        }
    }
}