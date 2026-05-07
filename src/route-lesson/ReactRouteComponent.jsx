import React, { useState, useEffect, useReducer } from 'react';
import {
	Routes,
	Route,
	NavLink,
	Outlet,
	useParams,
	useMatch,
	useNavigate,
	Navigate,
	useRoutes,
} from 'react-router-dom'; //Link
//NavLink - можно указывать ссылку как неактивную
//<a class="active" href="/catalog/product/2" data-discover="true" aria-current="page">ПК</a>
import styles from '../styles.module.css';

const database = {
	productList: [
		{ id: 1, name: 'Телевизор' },
		{ id: 2, name: 'ПК' },
		{ id: 3, name: 'Планшет' },
		{ id: 4, name: 'Фен' },
	],
	products: {
		1: { id: 1, name: 'Телевизор', price: 30000, amount: 27 },
		2: { id: 2, name: 'ПК', price: 100000, amount: 50 },
		3: { id: 3, name: 'Планшет', price: 50000, amount: 54 },
		4: { id: 4, name: 'Фен', price: 3500, amount: 40 },
	},
};

const fetchProductList = () => database.productList;

const fetchProduct = (id) =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve(database.products[id]);
		}, 2500);
	});

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

const LOADING_TIMEOUT = 3000;

const ProductNotFound = () => <div>товар не существует</div>;

const ProductLoadError = () => (
	<div>Ошибка загрузки товара, попробуйте ещё раз позднее</div>
);

const Product = () => {
	const [product, setProduct] = useState(null);
	const params = useParams();
	const navigate = useNavigate();
	//navigate(2) -переход по истории браузера на 2 шага вперёд, navigate(-1) - 1 шаг назад
	//const urlMatchData = useMatch('catalog/:type/:id');
	//console.log('urlMatchData = ', urlMatchData.params.type);

	//const product = fetchProduct(params.id);
	useEffect(() => {
		let isLoadingTimeout = false;
		let isProductLoaded = false;

		setTimeout(() => {
			isLoadingTimeout = true;

			if (!isProductLoaded) {
				navigate('/product-loaded-error', { replace: true }); //{replace: true} не создаётся шаг в истории браузера
			}

			//если ошибка переход на другую страницу без клика по ссылки
		}, LOADING_TIMEOUT);

		fetchProduct(params.id).then((loadedProduct) => {
			isProductLoaded = true;

			if (!isLoadingTimeout) {
				if (!loadedProduct) {
					navigate('/product-not-exist');
					return;
				}
				setProduct(loadedProduct);
			}
		});
	}, [navigate, params.id]); //product нед обновляем ссылка всегда одна и та же

	if (!product) {
		return null;
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
	const routes = useRoutes([
		{ path: '/', element: <MainPage /> },
		{
			path: '/catalog',
			element: <Catalog />,
			children: [
				{ path: 'product/:id', element: <Product /> },
				{ path: 'product/:id', element: <Product /> },
			],
		},
		{ path: '/contacts', element: <Contacts /> },
		{ path: '/product-load-error', element: <ProductLoadError /> },
		{ path: '/404', element: <NotFound /> },
		{ path: '*', element: <Navigate to="/404" /> },
	]);
	const pageNumber = 'one';
	return (
		<div className={styles.app}>
			<title>{`page ${pageNumber}`}</title>
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

			{routes}
		</div>
	);
};
//у react route есть дополнительная возможность описывать маршруты не используя jsx

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

// <Routes>
// 	<Route path="/" element={<MainPage />} />
// 	<Route path="/catalog" element={<Catalog />}>
// 		<Route path="product/:id" element={<Product />} />
// 		<Route path="service/:id" element={<Product />} />
// 	</Route>
// 	<Route path="/contacts" element={<Contacts />} />
// 	<Route path="/404" element={<NotFound />} />
// 	{/* <Route path="*" element={<Navigate to="/404" replace={true}/>} /> */}
// 	<Route path="*" element={<Navigate to="/404" />} />
// 	<Route
// 		path="/product-loaded-error"
// 		element={<ProductLoadError />}
// 	/>
// 	<Route
// 		path="/product-not-exist"
// 		element={<ProductNotFound />}
// 	/>
// </Routes>
