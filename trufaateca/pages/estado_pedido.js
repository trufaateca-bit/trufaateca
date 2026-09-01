import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function EstadoPedido() {
  const router = useRouter();
  const { order } = router.query;

  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    if (!order) return;

    supabase
      .from("compras")
      .select("*")
      .eq("stripe_session", order)
      .single()
      .then(({ data }) => setPedido(data));
  }, [order]);

  if (!pedido) return <p>Cargando...</p>;

  const pasos = ["Recibido", "Preparando", "Enviado", "Entregado"];
  const pasoActivo = pasos.indexOf(pedido.estado);

  return (
    <div className="tracking-page">
      <div className="tracking-card">

        <h1 className="tracking-title">Seguimiento de tu pedido</h1>
        <p className="tracking-sub">
          Pedido #{pedido.stripe_session.slice(0,8)} · Hola {pedido.nombre} 👋
        </p>

        <div className="tracking-progress">
          {pasos.map((p, i) => (
            <div key={p} className={`tracking-step ${i <= pasoActivo ? "active" : ""}`}>
              <div className="tracking-dot"></div>
              {i < pasos.length - 1 && <div className="tracking-line"></div>}
              <small>{p}</small>
            </div>
          ))}
        </div>

        <p>
          <strong>Estado:</strong> {pedido.estado}
        </p>

        <div className="tracking-products">
          <h3>Productos</h3>
          {pedido.productos_facil.split(",").map((p, i) => (
            <div key={i} className="tracking-product">{p}</div>
          ))}
        </div>

        {pedido.seguimiento && (
            <a href={`https://tracking.com/${pedido.seguimiento}`}>
                Ver seguimiento
            </a>
            )}


      </div>
    </div>
  );
}
