import React from 'react';
import {
	Routes,
	Route,
	NavLink,
	Outlet,
	useParams,
	useMatch,
} from 'react-router-dom'; //Link
//NavLink - можно указывать ссылку как неактивную
//<a class="active" href="/catalog/product/2" data-discover="true" aria-current="page">ПК</a>
import styles from '../styles.module.css';

// const MainPage = () => <div>Контент главной страницы</div>;
// const Catalog = () => <div>Контент каталога</div>;
// const Contacts = () => <div>Контент контактов</div>;

const fetchProductList = () => [
	{ id: 1, name: 'Телевизор' },
	{ id: 2, name: 'ПК' },
	{ id: 3, name: 'Планшет' },
	{ id: 4, name: 'Фен' },
];

const fetchProduct = (id) =>
	({
		1: { id: 1, name: 'Телевизор', price: 30000, amount: 27 },
		2: { id: 2, name: 'ПК', price: 100000, amount: 50 },
		3: { id: 3, name: 'Планшет', price: 50000, amount: 54 },
		4: { id: 4, name: 'Фен', price: 3500, amount: 40 },
	})[id]; //обращаемся к id объекта

const MainPage = () => <div>Контент главной страницы</div>;
const Catalog = () => (
	<div>
		<h3>Каталог товаров</h3>
		<ul>
			{fetchProductList().map(({ id, name }) => (
				<li key={id}>
					<NavLink to={`product/${id}`}>{name}</NavLink>
				</li>
			))}
		</ul>
		<Outlet />
	</div>
);

//id можно получить из параметров страницы, то есть адреса :(id)
//params.id
const ProductNotFound = () => <div>товар не существует</div>;
const Product = () => {
	const urlMatchData = useMatch('catalog/:type/:id');

	console.log('urlMatchData = ', urlMatchData.params.type);

	const params = useParams();
	const product = fetchProduct(params.id);

	if (!product) {
		return <ProductNotFound />;
	}

	const { name, price, amount } = product;

	return (
		<div>
			<h3>Товар - {name}</h3>
			<div>Цена - {price}</div>
			<div>На складе - {amount}</div>
		</div>
	);
};
const NotFound = () => <div>Страница не существует</div>;

const Contacts = () => <div>Контент контактов</div>;

const ExtendedLink = ({ to, children }) => (
	<NavLink to={to}>
		{({ isActive }) =>
			isActive ? (
				<>
					<span>{children}</span>
					<span>*</span>
					{/* <span children="* - не рекомендуется использовать " /> */}
				</>
			) : (
				<span>{children}</span>
			)
		}
	</NavLink>
);

//  href === to, to используется в NavLink чтобы страница не перезагружалась переходе
export const ReactRouteComponent = () => {
	return (
		<div className={styles.app}>
			<div>2. Routes, Route, NavLink</div>
			<div>
				<h3>Меню</h3>
				<ul>
					<li>
						<ExtendedLink to="/">Главная</ExtendedLink>
					</li>
					<li>
						<ExtendedLink to="/catalog">Каталог</ExtendedLink>
					</li>
					<li>
						<ExtendedLink to="/contacts">Контакты</ExtendedLink>
					</li>
				</ul>
			</div>
			<Routes>
				<Route path="/" element={<MainPage />} />
				<Route path="/catalog" element={<Catalog />}>
					<Route path="product/:id" element={<Product />} />
					<Route path="service/:id" element={<Product />} />
				</Route>
				<Route path="/contacts" element={<Contacts />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
};

/*			<div>
				<h3>Меню</h3>
				<ul>
					<li></li>

					<li>
						<NavLink to="/catalog">Каталог</NavLink>
					</li>
					<li>
						<NavLink to="/contacts">Контакты</NavLink>
					</li>
				</ul>
			</div> */
