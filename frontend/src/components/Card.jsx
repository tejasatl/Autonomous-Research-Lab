export default function Card({

  title,

  children,

  style={}

}){

  return(

    <div

      style={{

        background:"#ffffff",

        borderRadius:"12px",

        padding:"20px",

        boxShadow:

          "0 2px 8px rgba(0,0,0,0.08)",

        border:

          "1px solid #e5e7eb",

        marginBottom:"20px",

        ...style

      }}

    >

      {

        title &&

        <h2

          style={{

            marginTop:0,

            marginBottom:"15px"

          }}

        >

          {title}

        </h2>

      }

      {children}

    </div>

  );

}