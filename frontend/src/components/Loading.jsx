export default function Loading({

  text="Loading..."

}){

  return(

    <div

      style={{

        display:"flex",

        justifyContent:"center",

        alignItems:"center",

        height:"250px",

        fontSize:"22px",

        fontWeight:"bold",

        color:"#2563eb"

      }}

    >

      ⏳ {text}

    </div>

  );

}