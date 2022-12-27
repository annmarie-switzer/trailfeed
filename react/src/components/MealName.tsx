import './MealName.css';

type MealNameProps = {
    name: string;
    link: string;
};

export const MealName = ({ name, link }: MealNameProps) =>
    link ? (
        <a href={link} target="_blank" rel="noreferrer" className="meal-name">
            {name}
        </a>
    ) : (
        <span className="meal-name">{name}</span>
    );
