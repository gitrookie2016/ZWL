package com.l.zwl.Util;

import net.sf.json.JSONObject;

import java.io.*;

/**
 * Created by Lix on 2016-7-25.
 */
public class FoodUtil {

    public final static String path = new FileUtil().getClass().getResource("/").getFile().toString()+"foodFile/";


    /**
     * 写文件
     * @param str
     * @param fileName /wechatAccess_token.json
     * @return boolean
     */
    public boolean WriterFile (String str ,String type , String fileName){
        boolean flag = false;
        try {

            String filePath = path;
            if(type != null){
                filePath = path+type+"/";
            }
            File file = new File(filePath);


            if (!file.exists() && !file.isDirectory()){
                file.mkdirs();
            }

            FileWriter fw =  new FileWriter(filePath+fileName,false);
            BufferedWriter bw = new BufferedWriter(fw);
            bw.write(str);
            bw.flush();
            bw.close();
            flag = true;


        } catch (IOException e) {
            flag = false;
        }
        return flag;
    }

    /**
     * 读文件
     * @param fileName
     * @return String
     */
    public String ReaderFile(String fileName){

        JSONObject json = new JSONObject();

        json.put("Success",State.SUCCESS_IS_FALSE);

        if(fileName == null || fileName.isEmpty()){
            json.put("state",State.PARAMETER_IS_NULL);
            return json.toString();
        }

        StringBuffer buffer = new StringBuffer();
        try {

            String filePath = path+fileName;
            File file=new File(filePath);
            if(!file.exists()){
                return json.toString();
            }
            FileReader fr = new FileReader(filePath);

            String s;
            BufferedReader br = new BufferedReader(fr);
            while(null !=  (s = br.readLine())){
                buffer.append(s);
            }
            json.put("Success",State.SUCCESS_IS_TRUE);
            json.put("result",buffer.toString());

            br.close();
            fr.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            json.put("state",State.EXCEPTION);
            return json.toString();
        } catch (IOException e) {
            e.printStackTrace();
            json.put("state",State.EXCEPTION);
            return json.toString();
        }


        return json.toString();
    }

}
