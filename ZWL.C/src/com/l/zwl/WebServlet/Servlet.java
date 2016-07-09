package com.l.zwl.WebServlet;


import com.l.zwl.Util.WebHttp;
import net.sf.json.JSONObject;


import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Created by Lix on 2016-7-8.
 */
public class Servlet extends HttpServlet {


    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        this.doPost(req, resp);
    }


    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String data = req.getParameter("data");

        JSONObject jsondata =  JSONObject.fromObject(data);

        Iterator it = jsondata.keys();

        Map<String ,String> params= new HashMap<String,String>();

        String reJSON = "";

        if(jsondata != null){

            String url = "";
            String Authorization = "";

            while ( it.hasNext()){



                String key = it.next().toString();

                if("url".equals(key)){
                    url = jsondata.getString(key);
                }else if("Authorization".equals(key)){
                    Authorization = jsondata.getString(key);
                }else{
                    params.put(key,jsondata.getString(key));
                }

           }

            reJSON = WebHttp.doPost(url,params,Authorization);

        }
        resp.setCharacterEncoding("UTF-8");
        PrintWriter pw = resp.getWriter();

        pw.println(reJSON);
        pw.flush();
        pw.close();
    }
}
