import { useState, useEffect, SyntheticEvent } from "react";
import {
  Box,
  Circle,
  Divider,
  Heading,
  HStack,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import { FixedSizeList } from "react-window";

import { Checkbox } from "./Checkbox";
import { Filter } from "./Filter";

type IItem = Record<string, any>;

type IMultiSelect = {
  title: string;
  items: IItem[];
  onSelect?(items: IItem[]): void;
};

function MultiSelect({ title, items, onSelect }: IMultiSelect) {
  type ICheckboxStates = {
    [index: number]: boolean;
  };

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

  const empty = (
    <Box w="full" pt="15ex">
      <Circle
        size="2em"
        bg="gray.100"
        color="white"
        fontSize="8xl"
        m="0 auto"
        opacity="0.2"
      >
        🤷
      </Circle>
    </Box>
  );

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
          checked={checkedItems[item.id]}
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
    <VStack align="flex-start" w="full">
      <HStack w="full">
        <VStack align="flex-start">
          <Heading size="sm">{title}</Heading>
          <Checkbox
            id={`chk_${title}`}
            checked={allItemsChecked}
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
            Select All {title}
          </Checkbox>
        </VStack>
        <Spacer />
        <Filter
          title={title}
          items={items}
          filterKey="name"
          onFilter={(_filteredItems) => setFilteredItems(_filteredItems)}
        />
      </HStack>

      <Divider />

      {itemList}
    </VStack>
  );
}

export { MultiSelect };
