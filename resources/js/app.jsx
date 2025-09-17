import "./bootstrap";
import "../css/app.css";

console.log("React app starting...");

const el = document.getElementById("app");
console.log("Root element:", el);

if (el) {
    import("react-dom/client")
        .then(({ createRoot }) => {
            import("@inertiajs/react").then(({ createInertiaApp }) => {
                import("laravel-vite-plugin/inertia-helpers").then(
                    ({ resolvePageComponent }) => {
                        createInertiaApp({
                            title: (title) => `${title} - NaviTree`,
                            resolve: (name) =>
                                resolvePageComponent(
                                    `./Pages/${name}.jsx`,
                                    import.meta.glob("./Pages/**/*.jsx", {
                                        eager: true,
                                    })
                                ),
                            setup({ el: inertiaEl, App, props }) {
                                const root = createRoot(inertiaEl);
                                root.render(<App {...props} />);
                                console.log("Inertia app mounted successfully");
                            },
                        });
                    }
                );
            });
        })
        .catch((error) => {
            console.error("Error loading dependencies:", error);
        });
} else {
    console.error("CRITICAL: #app element not found in DOM");
}
