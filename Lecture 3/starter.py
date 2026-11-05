"""Лабораторна 3: заготовка, не готовий розв'язок. Python 3, без бібліотек."""
REQUIRED = ("principle", "data", "calculation", "unknown", "test")


def missing_fields(row):
    # TODO: повернути список відсутніх або порожніх полів.
    raise NotImplementedError("Реалізуйте перевірку полів")


def total_cost(items):
    # items: список пар (кількість, ціна одиниці).
    # TODO: обчислити суму; у вправі 3 врахувати None.
    raise NotImplementedError("Реалізуйте незалежний розрахунок")


if __name__ == "__main__":
    # Контроль іншого об'єкта: очікувано 170.
    print(total_cost([(2, 70), (1, 30)]))
