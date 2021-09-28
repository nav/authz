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
        aria-describedby="comments-description"
        name="comments"
        type="checkbox"
        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
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
