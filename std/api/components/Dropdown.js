import { createIconComponent } from "../createIconComponent.js";
import { S } from "../../index.js";
import { SVGIcons } from "../../static.js";
const CheckIcon = ()=>createIconComponent({
        icon: SVGIcons.check
    });
const DropdownMenuItem = ({ option, isActive, onSwitch, children })=>{
    const activeStyle = {
        backgroundColor: "rgba(var(--spice-rgb-selected-row),.1)"
    };
    return /*#__PURE__*/ S.React.createElement(S.ReactComponents.MenuItem, {
        trigger: "click",
        onClick: ()=>onSwitch(option),
        "data-checked": isActive,
        trailingIcon: isActive ? /*#__PURE__*/ S.React.createElement(CheckIcon, null) : undefined,
        style: isActive ? activeStyle : undefined
    }, children);
};
export default function({ options, activeOption, onSwitch }) {
    const { ContextMenu, Menu, TextComponent } = S.ReactComponents;
    const DropdownMenu = (props)=>{
        return /*#__PURE__*/ S.React.createElement(Menu, props, Object.entries(options).map(([option, children])=>/*#__PURE__*/ S.React.createElement(DropdownMenuItem, {
                option: option,
                isActive: option === activeOption,
                onSwitch: onSwitch
            }, children)));
    };
    return /*#__PURE__*/ S.React.createElement(ContextMenu, {
        menu: /*#__PURE__*/ S.React.createElement(DropdownMenu, null),
        trigger: "click"
    }, /*#__PURE__*/ S.React.createElement("button", {
        className: "w6j_vX6SF5IxSXrrkYw5",
        type: "button",
        role: "combobox",
        "aria-expanded": "false"
    }, /*#__PURE__*/ S.React.createElement("svg", {
        role: "img",
        height: "16",
        width: "16",
        "aria-hidden": "true",
        className: "Svg-img-16 Svg-img-16-icon Svg-img-icon Svg-img-icon-small",
        viewBox: "0 0 16 16",
        "data-encore-id": "icon"
    }, /*#__PURE__*/ S.React.createElement("path", {
        d: "m14 6-6 6-6-6h12z"
    }))));
}
