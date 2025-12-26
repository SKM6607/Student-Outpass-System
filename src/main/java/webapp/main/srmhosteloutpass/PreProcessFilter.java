package webapp.main.srmhosteloutpass;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import webapp.main.srmhosteloutpass.utilities.DBConnector;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import java.time.LocalDate;
import java.time.LocalTime;

@WebFilter("/secure/*")
public class PreProcessFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        Filter.super.init(filterConfig);
        Date date = Date.valueOf(LocalDate.now());
        Time time = Time.valueOf(LocalTime.now());
        System.err.printf("%n[DATE]: %s [TIME]: %s - [STARTUP] Server Filter [PreProcessFilter] has started authentication%n", date, time);
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        String registeredNumber=request.getParameter("registeredNumber");
        PrintWriter writer=response.getWriter();
        response.setContentType("text/plain");
        if(registeredNumber==null || registeredNumber.isEmpty()){
            writer.print("[ERROR] | [ATTRIBUTE] \"registeredNumber\" is null\\empty");
            return;
        }
        else if(!registeredNumber.startsWith("RA")){
            writer.print("[ERROR] | [ATTRIBUTE] \"registeredNumber\" is not valid");
            return;
        }
        try(Connection connection= DBConnector.getConnection()){
            PreparedStatement statement= connection.prepareStatement("SELECT id FROM students WHERE registeredNumber=?");
            statement.setString(1,registeredNumber);
            ResultSet resultSet=statement.executeQuery();
            if(!resultSet.next()){
                writer.print("[ERROR] | [NO_RECORDS] No records found for \"registeredNumber=\""+registeredNumber);
                return;
            }
        }catch (SQLException _){
            writer.print("[ERROR] | [SQL_DATABASE_ERROR] Could not establish connection");
            return;
        }
        System.out.println("\n[SUCCESS] | [INPUT_OK]");
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        Filter.super.destroy();
        Date date = Date.valueOf(LocalDate.now());
        Time time = Time.valueOf(LocalTime.now());
        System.err.printf("%n[DATE]: %s [TIME]: %s - [SHUTDOWN] Server Filter [PreProcessFilter] has stopped authentication%n", date, time);
    }
}
