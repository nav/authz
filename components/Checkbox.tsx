import styles from "./Checkbox.module.css";

type CheckboxProps = {
  id: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange: any;
  children: any;
  disabled?: boolean;
  style?: any;
};

function Checkbox(props: CheckboxProps) {
  return (
    <label htmlFor={props.id} className={styles.checkbox} style={props.style}>
      <input
        id={props.id}
        type="checkbox"
        checked={props.checked}
        defaultChecked={props.defaultChecked}
        disabled={props.disabled || false}
        onChange={props.onChange}
      />
      {props.children}
    </label>
  );
}

export { Checkbox };
