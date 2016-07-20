package com.l.zwl.WebServlet;


import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Method;

/**
 * Created by Lix on 2016-7-8.
 */
public class Servlet extends HttpServlet {

    // Action后缀，如/First对应FirstAction类
    private static final String ACTION_EXT="WebAction";
    // 自定义Action处理器所在的包名
    private static final String PACKAGE_NAME="com.l.zwl.Action.";

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        this.doPost(req, resp);
    }


    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String data = request.getParameter("data");

        String reJSON = "";

        if(data.isEmpty()){

           return ;
        }
        // 根据url找到对应的action

        String uri=request.getRequestURI();
        String path=request.getContextPath();


        String actionName=uri.substring(path.length()+1);

        String[] strs = actionName.split("/");

        String fullActionName=PACKAGE_NAME + strs[1];
        try {

            Class<?> ref = Class.forName(fullActionName);
            Method method = ref.getMethod(strs[2],String.class);
            reJSON = (String)method.invoke(ref.newInstance(),data);
        }
        catch (Exception e)
        {
            return ;
        }

        response.setCharacterEncoding("UTF-8");
        PrintWriter pw = response.getWriter();
        pw.println(reJSON);
        pw.flush();
        pw.close();
    }
}
