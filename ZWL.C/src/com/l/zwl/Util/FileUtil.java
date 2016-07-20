package com.l.zwl.Util;


import net.sf.json.JSON;

import java.io.*;

/**
 * Created by Lix on 2016-7-20.
 */
public class FileUtil {

    private final static String path = new FileUtil().getClass().getResource("/").getFile().toString()+"jsonFile/";;

    public static String getFilePath(){
        return path;
    }

    /**
     *
     * @param str
     * @param fileName /wechatAccess_token.json
     * @return boolean
     */
    public boolean WriterFile (String str , String fileName){

        if(str.isEmpty()){
            return false;
        }
        try {
            File file = new File(path+fileName);
            if (file.exists()){
                file.createNewFile();
            }

            FileWriter fw =  new FileWriter(file,false);
            BufferedWriter bw = new BufferedWriter(fw);
            bw.write(str);
            bw.flush();
            bw.close();

        } catch (IOException e) {
            return false;
        }
        return true;
    }

    public String ReaderFile(String fileName){
        if(fileName.isEmpty()){
            return null;
        }
        StringBuffer sbuf = new StringBuffer();
        try {
            FileReader fr = new FileReader(path+fileName);
            BufferedReader br = new BufferedReader(fr);
            while(null !=  br.readLine()){
                sbuf.append(br.readLine());
            }

            System.out.println(sbuf);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return sbuf.toString();

    }

    public static void main(String[] arg){
        new FileUtil().WriterFile("asdfaaaaaaaaaaaaaaaaaaaaaaaaaa","adfdfddfd.txt");
        new FileUtil().ReaderFile("adfdfddfd.txt");
    }
}
