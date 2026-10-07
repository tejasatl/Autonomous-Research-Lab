export default function PageHeader({

  title,

  subtitle

}){

  return(

    <div

      style={{

        marginBottom:"35px"

      }}

    >

      <h1

        style={{

          marginBottom:"8px"

        }}

      >

        {title}

      </h1>

      <p

        style={{

          color:"#666",

          margin:0

        }}

      >

        {subtitle}

      </p>

      <hr

        style={{

          marginTop:"20px",

          border:"none",

          borderTop:"1px solid #eee"

        }}

      />

    </div>

  );

}