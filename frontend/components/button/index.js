const Button = ({ color, icon, children }) => {
    return (
        <button
            style={{
                color,
            }}
            className={styles.button}
        ></button>
    );
};

export default Button;
