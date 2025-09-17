import React from "react";
import MenuItem from "./MenuItem";

const MenuTree = ({ menus, onEdit, onRefresh }) => {
    return (
        <div className="space-y-1">
            {menus.map((menu) => (
                <MenuItem
                    key={menu.id}
                    menu={menu}
                    level={0}
                    onEdit={onEdit}
                    onRefresh={onRefresh}
                />
            ))}
        </div>
    );
};

export default MenuTree;
