export default function StatCard({

  title,

  value,

  color="#2563eb"

}){

  return(

    <div

      style={{

        background:"white",

        borderRadius:"12px",

        padding:"24px",

        borderLeft:`6px solid ${color}`,

        boxShadow:

          "0 2px 10px rgba(0,0,0,.08)"

      }}

    >

      <div

        style={{

          fontSize:"15px",

          color:"#666"

        }}

      >

        {title}

      </div>

      <h1

        style={{

          marginTop:"12px",

          marginBottom:0,

          fontSize:"42px"

        }}

      >

        {value ?? 0}

      </h1>

    </div>

  );

}