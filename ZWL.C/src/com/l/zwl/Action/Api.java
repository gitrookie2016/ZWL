package com.l.zwl.Action;

import com.l.zwl.Util.FileUtil;
import com.l.zwl.Util.WebHttp;
import net.sf.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Created by Lix on 2016-7-20.
 */
public class Api {

    /**
     *
     * @return
     */
    public String requestApi(String Data){

        JSONObject jsondata =  JSONObject.fromObject(Data);

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
        return reJSON;
    }


    /**
     * 读取微信配置
     * @param Data
     * @return
     */
    public String ReaderFile(String Data){

        return "";
    }


    /**
     * 设置微信配置
     * @param Data
     * @return
     */
    public boolean WriterFile(String Data){

        if(Data.isEmpty()){
            return false;
        }
        

        return true;
    }


}
