import { useState, useEffect, SyntheticEvent } from "react";
import { FixedSizeList } from "react-window";

import { Checkbox } from "./Checkbox";
import { Filter } from "./Filter";

type IItem = Record<string, any>;

type IMultiSelect = {
  title: string;
  items: IItem[];
  isDisabled?: boolean;
  onSelect?(items: IItem[]): void;
};

function MultiSelect({ title, items, isDisabled, onSelect }: IMultiSelect) {
  type ICheckboxStates = {
    [index: number]: boolean;
  };

  if (typeof isDisabled === "undefined") {
    isDisabled = false;
  }
  /*
   * Wrapper for onSelect. If onSelect is undefined, assign a noop function
   * so that we don't have to repeat this check everywhere the function is used.
   */
  const _onSelect =
    typeof onSelect !== "undefined"
      ? onSelect
      : () => {
          return;
        };

  /*
   * Wrapper for setState function and any additonal side effects that happend
   * when an item is selected.
   */
  const toggleCheckbox = (
    states: ICheckboxStates,
    id: number,
    value: boolean,
    setMethod: any
  ) => {
    const statesClone = Object.assign({}, states);
    statesClone[id] = value;
    setMethod(statesClone);
    _onSelect(items.filter((item) => statesClone[item.id]));
  };

  const empty = <div>🤷</div>;

  const [filteredItems, setFilteredItems] = useState(items);

  const itemsDefaultState: ICheckboxStates = items.reduce(
    (obj, item) => Object.assign(obj, { [item.id]: false }),
    {}
  );

  const [checkedItems, setCheckedItems] = useState(itemsDefaultState);

  const allItemsChecked =
    Object.keys(checkedItems).length > 0
      ? Object.values(checkedItems).every(Boolean)
      : false;

  const Row = ({ index, style }: any) => {
    const item = filteredItems[index];
    const key = `${title}_item_${item.id}`;
    return (
      <div style={style}>
        <Checkbox
          key={key}
          id={`${title}_item_${item.id}`}
          disabled={isDisabled}
          checked={!isDisabled && checkedItems[item.id]}
          onChange={(e: SyntheticEvent) => {
            const target = e.target as HTMLInputElement;
            toggleCheckbox(
              checkedItems,
              item.id,
              target.checked,
              setCheckedItems
            );
          }}
        >
          {item.name}
        </Checkbox>
      </div>
    );
  };

  const itemList =
    filteredItems.length > 0 ? (
      <FixedSizeList
        height={500}
        width="100%"
        itemCount={filteredItems.length}
        itemSize={35}
      >
        {Row}
      </FixedSizeList>
    ) : (
      empty
    );

  return (
    <div>
      <div className="font-bold">{title}</div>
      <div className="grid grid-cols-2">
        <div className="mt-3">
          <Checkbox
            id={`chk_${title}`}
            checked={!isDisabled && allItemsChecked}
            disabled={isDisabled}
            onChange={(e: SyntheticEvent) => {
              const target = e.target as HTMLInputElement;
              setCheckedItems(
                filteredItems.reduce(
                  (obj, item) =>
                    Object.assign(obj, { [item.id]: target.checked }),
                  {}
                )
              );
              target.checked ? _onSelect(filteredItems) : _onSelect([]);
            }}
          >
            All {title}
          </Checkbox>
        </div>
        <Filter
          title={title}
          items={items}
          filterKey="name"
          onFilter={(_filteredItems) => setFilteredItems(_filteredItems)}
        />
      </div>

      <hr className="my-4" />
      {itemList}
    </div>
  );
}

export { MultiSelect };
